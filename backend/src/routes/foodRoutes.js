import { Router } from "express";
import { createFood, getAllFood } from "../controllers/foodController.js";

const router = Router();

router.get("/", getAllFood);
router.post("/", createFood);

export default router;
