import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { connectDatabase } from "./config/database.js";
import { seedFoodsIfEmpty } from "./seed/seedFoods.js";
import { errorHandler, AppError } from "./middleware/errorHandler.js";

import foodRoutes from "./routes/foodRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

import legacyFoodRouter from "../routes/foodRoute.js";
import userRouter from "../routes/userRoutes.js";
import cartRouter from "../routes/cartRoute.js";
import legacyOrderRouter from "../routes/orderRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");
const FRONTEND_DIST = path.join(REPO_ROOT, "frontend", "dist");
const ADMIN_DIST = path.join(REPO_ROOT, "admin", "admin", "dist");
const UPLOADS_DIR = path.join(__dirname, "../uploads");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function start() {
  await connectDatabase();
  await seedFoodsIfEmpty();
  ensureDir(UPLOADS_DIR);

  const app = express();
  const port = Number(process.env.PORT) || 5000;

  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN || true,
      credentials: true,
    })
  );
  app.use(express.json({ limit: "10mb" }));

  app.get("/api/health", (req, res) => {
    res.json({ success: true, message: "API is running" });
  });

  // Customer app API (frontend)
  app.use("/api/food", foodRoutes);
  app.use("/api/orders", orderRoutes);

  // Admin panel API (legacy routes: /api/food/list, /api/order, …)
  app.use("/api/food", legacyFoodRouter);
  app.use("/api/user", userRouter);
  app.use("/api/cart", cartRouter);
  app.use("/api/order", legacyOrderRouter);

  app.use("/images", express.static(UPLOADS_DIR));

  if (fs.existsSync(ADMIN_DIST)) {
    app.use("/admin", express.static(ADMIN_DIST));
    app.get("/admin/*", (req, res) => {
      res.sendFile(path.join(ADMIN_DIST, "index.html"));
    });
  } else {
    console.warn("Admin build not found. Run: npm run build:admin");
  }

  if (fs.existsSync(FRONTEND_DIST)) {
    app.use(express.static(FRONTEND_DIST));
    app.get("*", (req, res, next) => {
      if (
        req.path.startsWith("/api") ||
        req.path.startsWith("/images") ||
        req.path.startsWith("/admin")
      ) {
        return next();
      }
      res.sendFile(path.join(FRONTEND_DIST, "index.html"));
    });
  } else {
    console.warn("Frontend build not found. Run: npm run build:frontend");
    app.get("/", (req, res) => {
      res.send("FoodDel API is running. Build the frontend and redeploy.");
    });
  }

  app.use("/api", (req, res, next) => {
    next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
  });
  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`FoodDel running on port ${port}`);
    console.log(`  Customer app: /`);
    console.log(`  Admin panel:  /admin`);
    console.log(`  API:          /api`);
  });
}

start().catch((err) => {
  console.error("Failed to start:", err);
  process.exit(1);
});
