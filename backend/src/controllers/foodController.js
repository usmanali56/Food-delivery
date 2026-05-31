import mongoose from "mongoose";
import { Food } from "../models/Food.js";
import { AppError } from "../middleware/errorHandler.js";

export async function getAllFood(req, res, next) {
  try {
    const foods = await Food.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: foods });
  } catch (e) {
    next(e);
  }
}

export async function createFood(req, res, next) {
  try {
    const { name, description, price, image, category } = req.body;

    if (!name || !category) {
      throw new AppError("name and category are required");
    }
    if (price === undefined || price === null || Number(price) < 0) {
      throw new AppError("price must be a non-negative number");
    }

    const food = await Food.create({
      name,
      description: description ?? "",
      price: Number(price),
      image: typeof image === "string" ? image.trim() : "",
      category,
    });

    res.status(201).json({ success: true, data: food });
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      next(new AppError(e.message, 400));
    } else {
      next(e);
    }
  }
}
