import express from "express";
import { craftItem } from "../controllers/craftingController.js";

const router = express.Router();

router.post("/craft", async (req, res) => {
  const { userId, itemName } = req.body;
  const result = await craftItem(userId, itemName);

  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
});

export default router;
