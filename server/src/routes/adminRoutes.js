import express from 'express';
import {
  getAdminStats,
  getAdminOutlets,
  createOutlet,
  updateOutlet,
  getAdminUsers,
  assignVendorOutlet,
  getAdminOrders,
} from '../controllers/adminController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require ADMIN role
router.use(authenticate, requireRole('ADMIN'));

router.get('/stats', getAdminStats);
router.get('/outlets', getAdminOutlets);
router.post('/outlets', createOutlet);
router.patch('/outlets/:id', updateOutlet);
router.get('/users', getAdminUsers);
router.post('/assign-vendor', assignVendorOutlet);
router.get('/orders', getAdminOrders);

export default router;
