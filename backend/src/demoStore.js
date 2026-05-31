/** In-memory demo data when MONGO_URI is not set (Vercel works without Atlas setup). */

export const demoFoods = [
  {
    _id: "demo1",
    name: "Chicken Biryani",
    description: "Fragrant basmati rice with spiced chicken and potatoes.",
    price: 450,
    image: "",
    category: "Rice",
  },
  {
    _id: "demo2",
    name: "Beef Burger",
    description: "Juicy patty, cheddar, lettuce, and house sauce.",
    price: 650,
    image: "",
    category: "Fast Food",
  },
  {
    _id: "demo3",
    name: "Margherita Pizza",
    description: "Classic tomato, mozzarella, and fresh basil.",
    price: 899,
    image: "",
    category: "Pizza",
  },
  {
    _id: "demo4",
    name: "Chicken Karahi",
    description: "Wok-cooked chicken with tomatoes, ginger, and green chili.",
    price: 1200,
    image: "",
    category: "Curry",
  },
  {
    _id: "demo5",
    name: "Caesar Salad",
    description: "Crisp romaine, parmesan, croutons, and creamy dressing.",
    price: 350,
    image: "",
    category: "Salad",
  },
  {
    _id: "demo6",
    name: "Chocolate Brownie",
    description: "Dense brownie with dark chocolate chunks.",
    price: 250,
    image: "",
    category: "Dessert",
  },
];

const ordersByUser = new Map();

export function getDemoOrders(userId) {
  return ordersByUser.get(userId) ?? [];
}

export function addDemoOrder(order) {
  const list = ordersByUser.get(order.userId) ?? [];
  list.unshift(order);
  ordersByUser.set(order.userId, list);
  return order;
}
