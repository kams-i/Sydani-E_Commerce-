import { errorResponse } from '../utils/responses.ts';
import codes from '../utils/statusCodes.ts';
import axios from 'axios';
import { Order, sequelize } from '../models/index.ts';
import { OrderStatus } from '../models/order.ts';
import type { Response } from 'express';

/**
 * Verify a Paystack transaction by its reference and update the corresponding order status to 'paid'.
 */
export const verifyPaymentService = async (reference: string, res?: Response) => {
    if (!reference || typeof reference !== 'string' || reference.trim() === '') {
        if (res) {
            return errorResponse(res, codes.BAD_REQUEST, 'A valid transaction reference is required.');
        }
        throw new Error('Invalid transaction reference');
    }

    try {
        // 1. Call Paystack Verification API
        const paystackResponse = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference.trim()}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const transactionData = paystackResponse.data.data;

        if (!transactionData || transactionData.status !== 'success') {
            if (res) {
                return errorResponse(res, codes.BAD_REQUEST, 'Payment verification failed or was not successful.');
            }
            throw new Error('Payment was not successful on Paystack');
        }

        // 2. Find the order associated with this payment reference
        const order = await Order.findOne({
            where: { paymentReference: reference.trim() },
        });

        if (!order) {
            if (res) {
                return errorResponse(res, codes.NOT_FOUND, 'Associated order not found for this payment reference.');
            }
            throw new Error('Order not found');
        }

        // 3. If order is already paid, return early with success
        if (order.status === OrderStatus.PAID) {
            return {
                message: 'Payment already verified and order is marked as paid.',
                order,
                paystackData: transactionData,
            };
        }

        // 4. Update order status to paid
        await order.update({
            status: OrderStatus.PAID,
        });

        return {
            message: 'Payment verified successfully and order updated.',
            order,
            paystackData: transactionData,
        };
    } catch (error: any) {
        console.error('Verify payment error:', error?.response?.data || error);
        if (res && res.headersSent) {
            return;
        }
        if (res) {
            return errorResponse(
                res,
                codes.INTERNAL_SERVER_ERROR,
                error?.response?.data?.message || 'Internal server error during payment verification.'
            );
        }
        throw error;
    }
};

/**
 * Handle incoming webhooks from Paystack for background asynchronous updates.
 */
export const handleWebhookService = async (eventBody: any, res?: Response) => {
    try {
        const event = eventBody?.event;
        const data = eventBody?.data;

        // We are primarily interested in successful charge completions
        if (event === 'charge.success' && data) {
            const reference = data.reference;

            if (reference) {
                const order = await Order.findOne({
                    where: { paymentReference: reference },
                });

                if (order && order.status !== OrderStatus.PAID) {
                    await order.update({
                        status: OrderStatus.PAID,
                    });
                    console.log(`Webhook: Order ${order.id} successfully marked as PAID via reference ${reference}`);
                }
            }
        }

        if (res) {
            return res.status(200).json({ received: true });
        }
    } catch (error: any) {
        console.error('Webhook processing error:', error);
        if (res && res.headersSent) {
            return;
        }
        if (res) {
            return errorResponse(res, codes.INTERNAL_SERVER_ERROR, 'Webhook processing failed.');
        }
        throw error;
    }
};