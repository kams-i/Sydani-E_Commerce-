import {
    verifyPaymentService,
    handleWebhookService
} from '../services/paymentService.ts';
import type { AuthenticatedRequest } from '../middleware/authMiddleware.ts';
import { errorResponse, successResponse } from '../utils/responses.ts';
import codes from '../utils/statusCodes.ts';
import type { NextFunction, Response, Request } from 'express';

export const verifyPayment = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    try {
        const { reference } = req.params;
        if (!reference) {
            return errorResponse(res, codes.BAD_REQUEST, 'Transaction reference is required.');
        }

        const result = await verifyPaymentService(String(reference), res);

        if (res.headersSent) {
            return;
        }

        return successResponse(res, codes.OK, 'Payment verified successfully.', result);
    } catch (error: unknown) {
        if (!res.headersSent) {
            next(error);
        } else {
            console.error('--- VERIFY_PAYMENT_CONTROLLER ERROR ---', error);
        }
    }
};

export const handleWebhook = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    try {
        await handleWebhookService(req.body, res);

        if (res.headersSent) {
            return;
        }

        return res.status(200).json({ received: true });
    } catch (error: unknown) {
        if (!res.headersSent) {
            next(error);
        } else {
            console.error('--- HANDLE_WEBHOOK_CONTROLLER ERROR ---', error);
        }
    }
};