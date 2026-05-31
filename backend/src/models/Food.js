import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    /** Optional: menu photos are served from the React app under `src/assets/menu`. */
    image: { type: String, default: "" },
    category: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const Food = mongoose.model("Food", foodSchema);
