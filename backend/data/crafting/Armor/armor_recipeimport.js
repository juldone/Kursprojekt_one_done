import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ArmorRecipe from "./armor_recipeschema.js"; // Schema für die Rezepte
import connectDB from "../../../db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function armorrecipeImport(req, res) {
  try {
    // Verbindung zur Datenbank herstellen
    await connectDB();

    // JSON-Datei einlesen
    const recipeData = JSON.parse(
      await fs.promises.readFile(
        path.join(__dirname, ".", "armor_rezepte.json"),
        "utf-8"
      )
    );

    // Überprüfen, ob bereits existierende IDs in der Datenbank vorhanden sind
    const existingRecipes = await ArmorRecipe.find({
      recipeId: { $in: recipeData.map((recipe) => recipe.recipeId) },
    }).select("recipeId");

    const existingRecipeIds = new Set(
      existingRecipes.map((recipe) => recipe.recipeId)
    );

    // Filtere nur neue Rezepte, die noch nicht in der Datenbank existieren
    const newRecipes = recipeData.filter(
      (recipe) => !existingRecipeIds.has(recipe.recipeId)
    );

    if (newRecipes.length === 0) {
      return res.status(400).json({
        message:
          "Keine neuen Rezepte zum Importieren, alle IDs existieren bereits.",
      });
    }

    // Neue Rezepte in die Datenbank einfügen
    const insertedRecipes = await ArmorRecipe.insertMany(newRecipes);
    console.log("Rezepte erfolgreich importiert:", insertedRecipes);

    res.status(200).json({
      message: "Rezepte erfolgreich importiert",
      data: insertedRecipes,
    });
  } catch (error) {
    console.error("Fehler beim Importieren der Rezepte:", error);
    res.status(500).json({ error: "Fehler beim Importieren der Rezepte" });
  }
}
