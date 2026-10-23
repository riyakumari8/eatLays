import express from 'express';
import { getOutlets, getOutletById, getCategories } from '../controllers/outletController.js';

const router = express.Router();

router.get('/', getOutlets);
router.get('/categories', getCategories);
router.get('/:id', getOutletById);

export default router;
