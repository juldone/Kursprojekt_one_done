// Importiere das Express-Framework, das verwendet wird, um HTTP-Server und Routen zu erstellen
import express from "express";

// Importiere die craftItem-Funktion aus dem craftingController.js
// Diese Funktion führt die eigentliche Logik für das Craften eines Gegenstands durch
import { craftItem } from "./craftingController.js";

// Erstelle einen neuen Router-Instanz von Express
// Ein Router ermöglicht es, Anfragen an spezifische Routen oder Endpunkte zu leiten
const router = express.Router();

// Definiere einen POST-Endpunkt für den Crafting-Vorgang
// Der Endpunkt wird unter "/craft/:accountId/:itemId" aufgerufen und erwartet zwei Parameter: accountId und itemId
router.post("/craft/:accountId/:itemId", async (req, res) => {
  // Extrahiere die accountId und itemId aus den URL-Parametern
  const { accountId, itemId } = req.params;

  // Rufe die craftItem-Funktion auf, um das Crafting durchzuführen, und übergib accountId und itemId
  const result = await craftItem(accountId, itemId);

  // Überprüfe, ob das Crafting erfolgreich war
  if (result.success) {
    // Wenn das Crafting erfolgreich war, sende eine HTTP-Statusantwort 200 (OK)
    // Sende eine JSON-Antwort mit einer Erfolgsnachricht, die den Namen des gecrafteten Gegenstands enthält
    res
      .status(200)
      .json({ message: `Item ${result.item} wurde erfolgreich gecraftet.` });
  } else {
    // Falls das Crafting nicht erfolgreich war, sende eine HTTP-Statusantwort 400 (Bad Request)
    // Sende eine JSON-Antwort mit einer Fehlermeldung aus dem Ergebnis der craftItem-Funktion
    res.status(400).json({ error: result.error });
  }
});

// Exportiere den Router, damit er in anderen Dateien importiert und verwendet werden kann
export default router;
