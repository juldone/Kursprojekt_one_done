import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI; // Stelle sicher, dass .env die korrekte URI enthält

const weaponSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  baseAttack: { type: Number, required: true },
  type: { type: String, required: true }, // z.B. "sword", "axe", etc.
  rarity: { type: String, default: "common" },
});

const Weapon = mongoose.model("Weapon", weaponSchema);

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const weaponsData = JSON.parse(
      fs.readFileSync(path.resolve("data/waffen.json"), "utf-8")
    );
    await Weapon.insertMany(weaponsData);
    console.log("Waffen erfolgreich importiert");
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Fehler beim Importieren der Waffen:", error);
    mongoose.connection.close();
  });

export default Weapon;
