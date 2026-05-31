import express from "express";
import cors from "cors";
import foodRoutes from "./routes/foodRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { AppError, errorHandler } from "./middleware/errorHandler.js";

function isAllowedOrigin(origin) {
  if (!origin) return true;
  const configured = process.env.CLIENT_ORIGIN;
  if (configured && origin === configured) return true;
  if (/^https:\/\/[\w-]+\.vercel\.app$/i.test(origin)) return true;
  if (origin.startsWith("http://localhost:")) return true;
  return !configured;
}

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin(origin, callback) {
        if (isAllowedOrigin(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`CORS blocked for origin: ${origin}`));
        }
      },
      credentials: true,
    })
  );
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (req, res) => {
    res.json({
      success: true,
      message: "API is running",
      mongo: Boolean(process.env.MONGO_URI),
    });
  });

  app.use("/api/food", foodRoutes);
  app.use("/api/orders", orderRoutes);

  app.use((req, res, next) => {
    next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
  });

  app.use(errorHandler);

  return app;
}
