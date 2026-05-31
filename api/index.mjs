/**
 * Vercel serverless entry — customer API only (/api/health, /api/food, /api/orders).
 * Reuses the same Express app as local `backend/src/server.js`.
 */
import { connectDatabase } from "../backend/src/config/database.js";
import { createApp } from "../backend/src/app.js";
import { seedFoodsIfEmpty } from "../backend/src/seed/seedFoods.js";

let app;
let initPromise;

async function getApp() {
  if (!initPromise) {
    initPromise = (async () => {
      await connectDatabase();
      await seedFoodsIfEmpty();
      app = createApp();
    })();
  }
  await initPromise;
  return app;
}

export default async function handler(req, res) {
  const expressApp = await getApp();
  return expressApp(req, res);
}
