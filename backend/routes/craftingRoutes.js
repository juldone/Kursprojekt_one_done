import express from "express";
import { craftItem } from "../data/crafting/craftingfunc.js";

const router = express.Router();

// POST-Route für das Craften von Items
router.post("/craft", craftItem);

export default router;
