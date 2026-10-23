import express from 'express';
import { register, login, getMe, logout } from '../controllers/authController.js';
import { validateRegistration, validateLogin } from '../validators/authValidator.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.get('/me', authenticate, getMe);
router.post('/logout', logout);

export default router;
