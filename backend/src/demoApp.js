import express from "express";
import cors from "cors";
import { demoFoods, getDemoOrders, addDemoOrder } from "./demoStore.js";

function isAllowedOrigin(origin) {
  if (!origin) return true;
  const configured = process.env.CLIENT_ORIGIN;
  if (configured && origin === configured) return true;
  if (/^https:\/\/[\w-]+\.vercel\.app$/i.test(origin)) return true;
  if (origin.startsWith("http://localhost:")) return true;
  return !configured;
}

export function createDemoApp() {
  const app = express();

  app.use(
    cors({
      origin(origin, callback) {
        if (isAllowedOrigin(origin)) callback(null, true);
        else callback(new Error(`CORS blocked for origin: ${origin}`));
      },
      credentials: true,
    })
  );
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (req, res) => {
    res.json({
      success: true,
      message: "API is running (demo mode — add MONGO_URI for persistent data)",
      mongo: false,
      mode: "demo",
    });
  });

  app.get("/api/food", (req, res) => {
    res.json({ success: true, data: demoFoods });
  });

  app.post("/api/orders", (req, res) => {
    const { userId, items, totalAmount, address } = req.body;
    if (!userId || !items?.length || !address) {
      return res.status(400).json({ success: false, message: "Invalid order payload" });
    }
    const order = {
      _id: `demo-order-${Date.now()}`,
      userId,
      items,
      totalAmount: Number(totalAmount),
      address,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    addDemoOrder(order);
    res.status(201).json({ success: true, data: order });
  });

  app.get("/api/orders/:userId", (req, res) => {
    res.json({ success: true, data: getDemoOrders(req.params.userId) });
  });

  return app;
}
