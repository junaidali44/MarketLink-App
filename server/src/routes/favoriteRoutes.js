import { Router } from 'express';
import * as c from '../controllers/favoriteController.js';
import { verifyJWT, requireRole } from '../middleware/auth.js';

const router = Router();
router.use(verifyJWT, requireRole('customer'));
router.post('/:farmerId', c.toggleFavorite);
router.get('/', c.listFavorites);

export default router;