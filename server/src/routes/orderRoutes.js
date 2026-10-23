import express from 'express';
import { createOrder, getMyOrders, getOrderById } from '../controllers/orderController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { validateOrderCreation } from '../validators/orderValidator.js';

const router = express.Router();

// All order routes require authentication
router.use(authenticate);

// Student orders
router.post('/', requireRole('STUDENT'), validateOrderCreation, createOrder);
router.get('/my-orders', requireRole('STUDENT'), getMyOrders);
router.get('/:id', getOrderById);

export default router;
