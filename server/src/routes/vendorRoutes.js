import express from 'express';
import {
  getVendorOrders,
  updateOrderStatus,
  getVendorOutletInfo,
  updateOutletStatus,
  getVendorMenuItems,
  createMenuItem,
  updateMenuItem,
  toggleItemAvailability,
} from '../controllers/vendorController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All vendor routes require VENDOR role
router.use(authenticate, requireRole('VENDOR'));

// Orders management
router.get('/orders', getVendorOrders);
router.patch('/orders/:id/status', updateOrderStatus);

// Outlet management
router.get('/outlet', getVendorOutletInfo);
router.patch('/outlet/status', updateOutletStatus);

// Menu management
router.get('/menu-items', getVendorMenuItems);
router.post('/menu-items', createMenuItem);
router.patch('/menu-items/:id', updateMenuItem);
router.patch('/menu-items/:id/availability', toggleItemAvailability);

export default router;
