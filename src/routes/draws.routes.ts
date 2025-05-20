import { Router } from "express";
import {
  getAllDraw,
  getDrawById,
  createDraw,
  updateDraw,
  deleteDraw,
} from "../controllers/draws.controller";
import { verifyToken } from "../middlewares/verifyToken";

const router = Router();

// Rutas CRUD
router.get("/", verifyToken, getAllDraw);
router.get("/:id", verifyToken, getDrawById);
router.post("/", verifyToken, createDraw);
router.put("/:id", verifyToken, updateDraw);
router.delete("/:id", verifyToken, deleteDraw);

export default router;
