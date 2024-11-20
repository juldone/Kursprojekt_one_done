import User from "../User.js";
import WeaponRecipe from "./Weapon/waffen_recipeschema.js";
import ArmorRecipe from "./Armor/armor_recipeschema.js";
import { getRandomRarity } from "../../utils/chanceTable.js";

// Rüstungsrezepte abrufen
export const getArmorRecipes = async (req, res) => {
  try {
    const recipes = await ArmorRecipe.find();
    res.status(200).json(recipes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Fehler beim Abrufen der Rüstungsrezepte", error });
  }
};

// Waffenrezepte abrufen
export const getWeaponRecipes = async (req, res) => {
  try {
    const recipes = await WeaponRecipe.find();
    res.status(200).json(recipes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Fehler beim Abrufen der Waffenrezepte", error });
  }
};

export const weaponcraftItem = async (req, res) => {
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

    // Berechnung des Schadens basierend auf der Seltenheit
    let damage;
    switch (rarity) {
      case "common":
        damage = recipe.damage * 1;
        break;
      case "uncommon":
        damage = recipe.damage * 1.5;
        break;
      case "rare":
        damage = recipe.damage * 2.0;
        break;
      case "epic":
        damage = recipe.damage * 3.0;
        break;
      case "legendary":
        damage = recipe.damage * 4.0;
        break;
      default:
        damage = recipe.damage; // Fallback
    }

    // Erstelle das gecraftete Item
    const craftedItem = {
      itemName: recipe.name,
      type: recipe.type,
      rarity,
      damage, // Verwendet den berechneten Wert
    };

    // Füge das Item dem Inventar des Users hinzu
    user.weaponinventory.push(craftedItem);

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
export const armorcraftItem = async (req, res) => {
  try {
    const { accountId, recipeId } = req.body; // User-ID und Recipe-ID vom Client
    const user = await User.findOne({ accountId }); // Hole den User aus der DB

    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }

    // Finde das Rezept, das der Spieler herstellen möchte
    const recipe = await ArmorRecipe.findOne({ recipeId });

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

    // Berechnung der Verteidigung basierend auf der Seltenheit
    let armor;
    switch (rarity) {
      case "common":
        armor = recipe.armor * 1;
        break;
      case "uncommon":
        armor = recipe.armor * 1.5;
        break;
      case "rare":
        armor = recipe.armor * 2.0;
        break;
      case "epic":
        armor = recipe.armor * 3.0;
        break;
      case "legendary":
        armor = recipe.armor * 4.0;
        break;
      default:
        armor = recipe.armor; // Fallback
    }

    // Erstelle das gecraftete Item
    const craftedItem = {
      itemName: recipe.name,
      type: recipe.type,
      rarity,
      armor, // Verwendet den berechneten Wert
    };

    // Füge das Item dem Inventar des Users hinzu
    user.armorinventory.push(craftedItem);

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
