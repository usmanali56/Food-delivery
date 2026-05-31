import beefBurger from "../assets/menu/beef-burger.svg";
import caesarSalad from "../assets/menu/caesar-salad.svg";
import chickenBiryani from "../assets/menu/chicken-biryani.svg";
import chickenKarahi from "../assets/menu/chicken-karahi.svg";
import chocolateBrownie from "../assets/menu/chocolate-brownie.svg";
import margheritaPizza from "../assets/menu/margherita-pizza.svg";

/** Maps menu item name → bundled asset (Vite resolves to a URL). */
const MENU_IMAGES = {
  "Chicken Biryani": chickenBiryani,
  "Beef Burger": beefBurger,
  "Margherita Pizza": margheritaPizza,
  "Chicken Karahi": chickenKarahi,
  "Caesar Salad": caesarSalad,
  "Chocolate Brownie": chocolateBrownie,
};

export function getMenuImageSrc(name) {
  if (!name) return null;
  return MENU_IMAGES[name] ?? null;
}
