// Endpunkte für Crafting-Anfragen
import express from "express";
import { craftItem } from "./craftingController.js";

const router = express.Router();

router.post("/craft/:accountId/:itemId", async (req, res) => {
  const { accountId, itemId } = req.params;
  const result = await craftItem(accountId, itemId);

  if (result.success) {
    res
      .status(200)
      .json({ message: `Item ${result.item} wurde erfolgreich gecraftet.` });
  } else {
    res.status(400).json({ error: result.error });
  }
});

export default router;
