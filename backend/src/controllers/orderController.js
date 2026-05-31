import mongoose from "mongoose";
import { Order } from "../models/Order.js";
import { AppError } from "../middleware/errorHandler.js";

function normalizeItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new AppError("items must be a non-empty array");
  }
  return items.map((it) => {
    if (!it.foodId || !it.name || it.price === undefined || !it.quantity) {
      throw new AppError("Each item needs foodId, name, price, and quantity");
    }
    return {
      foodId: it.foodId,
      name: it.name,
      price: Number(it.price),
      quantity: Number(it.quantity),
      image: it.image ?? "",
    };
  });
}

export async function createOrder(req, res, next) {
  try {
    const { userId, items, totalAmount, address } = req.body;

    if (!userId || typeof userId !== "string") {
      throw new AppError("userId is required");
    }
    if (!address || typeof address !== "string") {
      throw new AppError("address is required");
    }
    if (totalAmount === undefined || totalAmount === null || Number(totalAmount) < 0) {
      throw new AppError("totalAmount must be a non-negative number");
    }

    const normalizedItems = normalizeItems(items);

    const order = await Order.create({
      userId,
      items: normalizedItems,
      totalAmount: Number(totalAmount),
      address,
    });

    res.status(201).json({ success: true, data: order });
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      next(new AppError(e.message, 400));
    } else {
      next(e);
    }
  }
}

export async function getOrdersByUser(req, res, next) {
  try {
    const { userId } = req.params;
    if (!userId) {
      throw new AppError("userId is required", 400);
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: orders });
  } catch (e) {
    next(e);
  }
}
