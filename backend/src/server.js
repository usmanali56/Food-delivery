import "dotenv/config";
import { createApp } from "./app.js";
import { connectDatabase } from "./config/database.js";
import { seedFoodsIfEmpty } from "./seed/seedFoods.js";

const PORT = Number(process.env.PORT) || 5000;

async function start() {
  await connectDatabase();
  await seedFoodsIfEmpty();

  const app = createApp();
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start server:", err);
  process.exit(1);
});
