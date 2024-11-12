import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";
import { login } from "./utils/login.js";
import { protect } from "./utils/protected.js";
import { register } from "./utils/register.js";
import { craftRandomItem } from "file:///C:/Users/Tim%60s%20PC/BaJuTi_Gaming/BaJuTi_Gaming/backend/craftingSystem.js"; // Relative Pfadangabe versucht, da Modul bisher nicht geladen werden konnte

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB-Verbindung
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MongoDB URI nicht gefunden. Bitte in der .env Datei setzen.");
  process.exit(1);
}

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB verbunden"))
  .catch((error) => console.error("MongoDB Verbindungsfehler:", error));

app.post("/register", register);
app.post("/login", login);
app.get("/protected", protect);

// Route zum Testen des Crafting-Systems
app.get("/craft", (req, res) => {
  const result = craftRandomItem();
  res.json({
    message: `Du hast ein ${result.rarity} ${result.itemType} erhalten!`,
  });
});

app.use(express.static(path.resolve("public")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
