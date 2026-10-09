import express from 'express';
import type { Router } from 'express';
import {
    verifyPayment,
    handleWebhook
} from '../controllers/paymentController.ts';
import { authenticate } from '../middleware/authMiddleware.ts';

const router: Router = express.Router();

// --- PROTECTED PAYMENT ROUTES ---
// User must be authenticated to verify their payment
router.get(
    '/verify/:reference',
    authenticate,
    verifyPayment
);

// --- PUBLIC WEBHOOK ROUTE ---
// Called directly by Paystack servers (must remain unauthenticated so Paystack can post payloads freely)
router.post(
    '/webhook',
    handleWebhook
);

export default router;