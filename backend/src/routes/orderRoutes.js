import { Router } from "express";
import { createOrder, getOrdersByUser } from "../controllers/orderController.js";

const router = Router();

router.post("/", createOrder);
router.get("/:userId", getOrdersByUser);

export default router;
