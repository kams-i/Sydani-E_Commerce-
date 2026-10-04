import express from 'express';
import type { Router } from 'express';
import {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart
} from '../controllers/cartController.ts';
import { authenticate, authorize } from '../middleware/authMiddleware.ts';

const router: Router = express.Router();

// --- PROTECTED BUYER CART ROUTES ---
// Only users who are logged in AND have the 'buyer' role can access these:

router.get(
    '/',
    authenticate,
    authorize('buyer'),
    getCart
);

router.post(
    '/items',
    authenticate,
    authorize('buyer'),
    addToCart
);

router.put(
    '/items/:id',
    authenticate,
    authorize('buyer'),
    updateCartItem
);

router.delete(
    '/items/:id',
    authenticate,
    authorize('buyer'),
    removeCartItem
);

router.delete(
    '/clear',
    authenticate,
    authorize('buyer'),
    clearCart
);

export default router;