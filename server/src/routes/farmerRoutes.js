import { Router } from 'express';
import * as c from '../controllers/farmerController.js';
import { verifyJWT, requireRole } from '../middleware/auth.js';

const router = Router();
router.get('/', c.list);
router.get('/me', verifyJWT, requireRole('farmer'), c.myProfile);
router.put('/profile', verifyJWT, requireRole('farmer'), c.updateProfile);
router.get('/:id', c.getOne);
router.get('/:id/products', c.getProducts);

export default router;