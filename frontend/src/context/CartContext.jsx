import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { getMenuImageSrc } from "../lib/menuImages.js";

const FREE_DELIVERY_THRESHOLD = 1000;
const DELIVERY_CHARGE = 150;

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const existing = state.find((i) => i.foodId === action.item.foodId);
      if (existing) {
        return state.map((i) =>
          i.foodId === action.item.foodId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...state, { ...action.item, quantity: 1 }];
    }
    case "INC": {
      return state.map((i) =>
        i.foodId === action.foodId ? { ...i, quantity: i.quantity + 1 } : i
      );
    }
    case "DEC": {
      return state
        .map((i) =>
          i.foodId === action.foodId ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0);
    }
    case "REMOVE":
      return state.filter((i) => i.foodId !== action.foodId);
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const dispatch = useCallback((action) => {
    setItems((prev) => cartReducer(prev, action));
  }, []);

  const addToCart = useCallback(
    (food) => {
      dispatch({
        type: "ADD",
        item: {
          foodId: food._id,
          name: food.name,
          price: food.price,
          image: getMenuImageSrc(food.name) ?? "",
          category: food.category,
        },
      });
    },
    [dispatch]
  );

  const increaseQty = useCallback(
    (foodId) => {
      dispatch({ type: "INC", foodId });
    },
    [dispatch]
  );

  const decreaseQty = useCallback(
    (foodId) => {
      dispatch({ type: "DEC", foodId });
    },
    [dispatch]
  );

  const removeItem = useCallback(
    (foodId) => {
      dispatch({ type: "REMOVE", foodId });
    },
    [dispatch]
  );

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, [dispatch]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const delivery = subtotal > FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
    const grandTotal = subtotal + delivery;
    return { subtotal, delivery, grandTotal, freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD };
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      addToCart,
      increaseQty,
      decreaseQty,
      removeItem,
      clearCart,
      ...totals,
    }),
    [items, addToCart, increaseQty, decreaseQty, removeItem, clearCart, totals]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
