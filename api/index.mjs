/**
 * Vercel serverless entry — customer API (/api/health, /api/food, /api/orders).
 */
import { connectDatabase } from "../backend/src/config/database.js";
import { createApp } from "../backend/src/app.js";
import { seedFoodsIfEmpty } from "../backend/src/seed/seedFoods.js";

export const config = {
  maxDuration: 30,
};

let app;
let initPromise;

async function getApp() {
  if (!process.env.MONGO_URI) {
    const err = new Error(
      "MONGO_URI is missing. Add it in Vercel → Project → Settings → Environment Variables."
    );
    err.statusCode = 503;
    throw err;
  }

  if (!initPromise) {
    initPromise = (async () => {
      await connectDatabase();
      try {
        await seedFoodsIfEmpty();
      } catch (seedErr) {
        console.error("Seed warning:", seedErr);
      }
      app = createApp();
    })().catch((err) => {
      initPromise = null;
      throw err;
    });
  }

  await initPromise;
  return app;
}

export default async function handler(req, res) {
  try {
    const expressApp = await getApp();
    return expressApp(req, res);
  } catch (err) {
    console.error("API handler error:", err);
    if (!res.headersSent) {
      res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal server error",
      });
    }
  }
}
