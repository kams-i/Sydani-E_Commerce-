import { errorResponse } from '../utils/responses.ts';
import codes from '../utils/statusCodes.ts';
import axios from 'axios';
import User from '../models/user.ts';
import { Cart, CartItem, Product, Order, OrderItem, sequelize } from '../models/index.ts';
import type { Response } from 'express';

export interface CheckoutPayload {
    shippingAddress: string;
    paymentMethod?: 'card' | 'wallet' | 'transfer';
    [key: string]: any;
}

/**
 * Fetch all orders belonging to a specific user, including associated order items and products.
 */
export const getUserOrdersService = async (userId: string, res?: Response) => {
    try {
        const orders = await Order.findAll({
            where: { userId },
            include: [
                {
                    model: OrderItem,
                    as: 'items',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                        },
                    ],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        return orders;
    } catch (error: any) {
        console.error('Get user orders error:', error);
        if (res) {
            return errorResponse(res, codes.INTERNAL_SERVER_ERROR, 'Internal server error while fetching orders.');
        }
        throw error;
    }
};

/**
 * Fetch a single order by ID for a specific user.
 */
export const getOneOrderService = async (userId: string, orderId: string, res?: Response) => {
    try {
        const order = await Order.findOne({
            where: { id: orderId, userId },
            include: [
                {
                    model: OrderItem,
                    as: 'items',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                        },
                    ],
                },
            ],
        });

        if (!order) {
            if (res) {
                return errorResponse(res, codes.NOT_FOUND, 'Order not found.');
            }
            throw new Error('Order not found');
        }

        return order;
    } catch (error: any) {
        console.error('Get one order error:', error);
        if (res && res.headersSent) {
            return;
        }
        if (res) {
            return errorResponse(res, codes.INTERNAL_SERVER_ERROR, 'Internal server error while fetching order.');
        }
        throw error;
    }
};

/**
 * Checkout the user's active cart, create an order, deduct stock, and clear the cart.
 */
export const checkoutService = async (
    userId: string,
    payload: CheckoutPayload,
    res?: Response
) => {
    const { shippingAddress, paymentMethod } = payload;

    if (!shippingAddress || typeof shippingAddress !== 'string' || shippingAddress.trim() === '') {
        if (res) {
            return errorResponse(res, codes.BAD_REQUEST, 'A valid shipping address is required.');
        }
        throw new Error('Invalid shipping address');
    }

    if (paymentMethod !== undefined && !['card', 'wallet', 'transfer'].includes(paymentMethod)) {
        if (res) {
            return errorResponse(res, codes.BAD_REQUEST, 'A valid payment method is required.');
        }
        throw new Error('Invalid payment method');
    }

    const t = await sequelize.transaction();
    let isCommitted = false;

    try {
        // 0. Fetch the user to get their email address for Paystack
        const user = await User.findByPk(userId, { transaction: t });
        if (!user || !user.email) {
            await t.rollback();
            if (res) {
                return errorResponse(res, codes.NOT_FOUND, 'User account or email not found.');
            }
            throw new Error('User not found');
        }

        // 1. Fetch user cart along with items and products inside the transaction
        const cart = (await Cart.findOne({
            where: { userId },
            include: [
                {
                    model: CartItem,
                    as: 'items',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                        },
                    ],
                },
            ],
            transaction: t,
        })) as unknown as (Cart & { items?: CartItem[] }) | null;

        if (!cart || !cart.items || cart.items.length === 0) {
            await t.rollback();
            if (res) {
                return errorResponse(res, codes.BAD_REQUEST, 'Your cart is empty.');
            }
            throw new Error('Cart is empty');
        }

        let totalAmount = 0;

        // 2. Validate live stock availability for every cart item
        for (const item of cart.items) {
            const product = (item as any).product;
            if (!product) {
                await t.rollback();
                if (res) {
                    return errorResponse(res, codes.NOT_FOUND, 'One or more products in your cart no longer exist.');
                }
                throw new Error('Product not found');
            }

            if (product.stock < item.quantity) {
                await t.rollback();
                if (res) {
                    return errorResponse(
                        res,
                        codes.BAD_REQUEST,
                        `Product "${product.title}" has insufficient stock. Available: ${product.stock}, Requested: ${item.quantity}.`
                    );
                }
                throw new Error('Insufficient stock');
            }

            totalAmount += Number(product.price) * item.quantity;
        }

        // 3. Create the Order record (initially 'pending')
        const order = await Order.create(
            {
                userId,
                totalAmount,
                shippingAddress: shippingAddress.trim(),
                paymentMethod: paymentMethod ?? null,
                status: 'pending',
            },
            { transaction: t }
        );

        // 4. Create Order Items, capture price at purchase, and decrement product stock
        for (const item of cart.items) {
            const product = (item as any).product;

            await OrderItem.create(
                {
                    orderId: order.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    priceAtPurchase: product.price,
                },
                { transaction: t }
            );

            // Deduct inventory stock securely
            await product.decrement('stock', {
                by: item.quantity,
                transaction: t,
            });
        }

        // 5. Clear the user's cart items post-checkout
        await CartItem.destroy({
            where: { cartId: cart.id },
            transaction: t,
        });

        // 6. Call Paystack Initialization API
        // Paystack expects amount in Kobo (multiply Naira amount by 100)
        const amountInKobo = Math.round(totalAmount * 100);

        const paystackResponse = await axios.post(
            'https://api.paystack.co/transaction/initialize',
            {
                email: user.email,
                amount: amountInKobo,
                metadata: {
                    orderId: order.id,
                    userId: userId,
                },
                // Optional: callback_url: 'https://sydani-e-commerce.vercel.app/checkout/complete'
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const paystackData = paystackResponse.data.data;

        // 7. Save the Paystack reference to your order so you can verify it later
        await order.update(
            { paymentReference: paystackData.reference },
            { transaction: t }
        );

        // Commit transaction
        await t.commit();
        isCommitted = true;

        // Return order info along with Paystack checkout/authorization URL for the frontend
        if (res) {
            return res.status(200).json({
                success: true,
                message: 'Checkout initialized successfully',
                data: {
                    orderId: order.id,
                    totalAmount,
                    authorizationUrl: paystackData.authorization_url,
                    accessCode: paystackData.access_code,
                    reference: paystackData.reference,
                },
            });
        }

        return order;
    } catch (error: any) {
        if (!isCommitted) {
            try {
                await t.rollback();
            } catch (rollbackError) {
                console.error('Rollback error:', rollbackError);
            }
        }
        if (res && res.headersSent) {
            return;
        }
        console.error('Checkout error:', error?.response?.data || error);
        if (res) {
            return errorResponse(
                res,
                codes.INTERNAL_SERVER_ERROR,
                error?.response?.data?.message || 'Internal server error during checkout.'
            );
        }
        throw error;
    }
};