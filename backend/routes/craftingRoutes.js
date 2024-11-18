import express from "express";
import {
  armorcraftItem,
  getArmorRecipes,
  getWeaponRecipes,
  weaponcraftItem,
} from "../data/crafting/craftingfunc.js";

const router = express.Router();

// POST-Route für das Craften von Items
router.post("/wpncraft", weaponcraftItem);
router.post("/armcraft", armorcraftItem);

// GET-Routen für Rezepte
router.get("/armrecipes", getArmorRecipes);
router.get("/wpnrecipes", getWeaponRecipes);

export default router;
