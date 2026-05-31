import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 15000,
});

export async function fetchFoods() {
  const { data } = await api.get("/food");
  return data.data;
}

export async function createFood(payload) {
  const { data } = await api.post("/food", payload);
  return data.data;
}

export async function placeOrder(payload) {
  const { data } = await api.post("/orders", payload);
  return data.data;
}

export async function fetchOrdersByUser(userId) {
  const { data } = await api.get(`/orders/${encodeURIComponent(userId)}`);
  return data.data;
}
