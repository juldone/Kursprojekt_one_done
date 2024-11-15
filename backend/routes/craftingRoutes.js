import express from "express";
import {
  armorcraftItem,
  weaponcraftItem,
} from "../data/crafting/craftingfunc.js";

const router = express.Router();

// POST-Route für das Craften von Items
router.post("/wpncraft", weaponcraftItem);
router.post("/armcraft", armorcraftItem);

export default router;
