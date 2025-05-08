import { Router } from 'express';
import { getAllDraw, getDrawById, createDraw, updateDraw, deleteDraw } from '../controllers/draws.controller';

const router = Router();

// Rutas CRUD
router.get('/', getAllDraw);
router.get('/:id', getDrawById);
router.post('/', createDraw);
router.put('/:id', updateDraw);
router.delete('/:id', deleteDraw);

export default router;
