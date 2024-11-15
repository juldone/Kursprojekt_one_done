import User from "../User.js";
import WeaponRecipe from "./Weapon/waffen_recipeschema.js";
import { getRandomRarity } from "../../utils/chanceTable.js";
export const craftItem = async (req, res) => {
  try {
    const { accountId, recipeId } = req.body; // User-ID und Recipe-ID vom Client
    const user = await User.findOne({ accountId }); // Hole den User aus der DB

    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }

    // Finde das Rezept, das der Spieler herstellen möchte
    const recipe = await WeaponRecipe.findOne({ recipeId });

    if (!recipe) {
      return res.status(404).json({ message: "Rezept nicht gefunden" });
    }

    // Überprüfe, ob der User genug Materialien hat
    const { Holz, Stein, Metall } = recipe.materials;

    if (
      user.materials.Holz < Holz ||
      user.materials.Stein < Stein ||
      user.materials.Metall < Metall
    ) {
      return res
        .status(400)
        .json({ message: "Du hast nicht genügend Materialien" });
    }

    // Ziehe die Materialien ab
    user.materials.Holz -= Holz;
    user.materials.Stein -= Stein;
    user.materials.Metall -= Metall;

    // Speichern der Änderungen im User-Dokument
    await user.save();

    // Bestimme die Seltenheit des Items basierend auf der Chance-Tabelle
    const rarity = getRandomRarity();

    // Erstelle das Item (beispielhaft eine Waffe)
    const craftedItem = {
      itemName: recipe.name,
      rarity,
    };

    // Füge das Item dem Inventar des Users hinzu
    user.inventory.push(craftedItem);

    // Speichern des geänderten Inventars
    await user.save();

    return res.status(200).json({
      message: `Du hast erfolgreich ein ${rarity} ${recipe.name} gecraftet!`,
      craftedItem,
      remainingMaterials: user.materials,
    });
  } catch (error) {
    console.error("Fehler beim Craften des Items:", error);
    res.status(500).json({ message: "Fehler beim Craften des Items" });
  }
};
