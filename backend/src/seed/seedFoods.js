import { Food } from "../models/Food.js";

/**
 * Demo menu rows. `image` is left empty — the frontend maps each `name` to a file in
 * `frontend/src/assets/menu` (see `menuImages.js`).
 */
const demoFoods = [
  {
    name: "Chicken Biryani",
    description: "Fragrant basmati rice with spiced chicken and potatoes.",
    price: 450,
    image: "",
    category: "Rice",
  },
  {
    name: "Beef Burger",
    description: "Juicy patty, cheddar, lettuce, and house sauce.",
    price: 650,
    image: "",
    category: "Fast Food",
  },
  {
    name: "Margherita Pizza",
    description: "Classic tomato, mozzarella, and fresh basil.",
    price: 899,
    image: "",
    category: "Pizza",
  },
  {
    name: "Chicken Karahi",
    description: "Wok-cooked chicken with tomatoes, ginger, and green chili.",
    price: 1200,
    image: "",
    category: "Curry",
  },
  {
    name: "Caesar Salad",
    description: "Crisp romaine, parmesan, croutons, and creamy dressing.",
    price: 350,
    image: "",
    category: "Salad",
  },
  {
    name: "Chocolate Brownie",
    description: "Dense brownie with dark chocolate chunks.",
    price: 250,
    image: "",
    category: "Dessert",
  },
];

export async function seedFoodsIfEmpty() {
  const count = await Food.countDocuments();
  if (count === 0) {
    await Food.insertMany(demoFoods);
    // eslint-disable-next-line no-console
    console.log("Seeded demo foods.");
    return;
  }

  // Clear remote image URLs on known demo dishes (images now live in the React app).
  let patched = 0;
  for (const food of demoFoods) {
    const res = await Food.updateOne({ name: food.name }, { $set: { image: food.image } });
    patched += res.modifiedCount ?? 0;
  }
  if (patched) {
    // eslint-disable-next-line no-console
    console.log(`Updated image field on ${patched} demo food row(s).`);
  }
}
