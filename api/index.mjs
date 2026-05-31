/**
 * Vercel serverless — uses MongoDB when MONGO_URI is set, otherwise demo mode (no config needed).
 */
import { connectDatabase } from "../backend/src/config/database.js";
import { createApp } from "../backend/src/app.js";
import { createDemoApp } from "../backend/src/demoApp.js";
import { seedFoodsIfEmpty } from "../backend/src/seed/seedFoods.js";

export const config = {
  maxDuration: 30,
};

let app;
let initPromise;
let demoMode = false;

async function getApp() {
  if (initPromise) {
    await initPromise;
    return app;
  }

  if (!process.env.MONGO_URI) {
    demoMode = true;
    app = createDemoApp();
    return app;
  }

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
    console.error("Mongo init failed, falling back to demo mode:", err);
    demoMode = true;
    app = createDemoApp();
  });

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
      res.status(500).json({
        success: false,
        message: err.message || "Internal server error",
      });
    }
  }
}
