import express from "express"; // Importiert das Express-Modul, um eine Web-Server-Routerinstanz zu erstellen
import { craftItem } from "../controllers/craftingController.js"; // Importiert die Funktion craftItem aus dem craftingController, die die Logik für das Craften eines Items enthält

const router = express.Router(); // Erstellt eine neue Routerinstanz von Express, um Routen für HTTP-Anfragen zu definieren

// Route zum Craften eines Items
router.post("/craft", craftItem); // Definiert eine POST-Route unter dem Pfad "/craft", die die Funktion craftItem aufruft, um ein Item zu erstellen

export default router; // Exportiert den Router, sodass er in anderen Dateien importiert und verwendet werden kann
