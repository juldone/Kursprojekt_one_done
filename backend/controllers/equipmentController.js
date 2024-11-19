import User from "../data/User.js";

// Funktion: Ausrüstung wechseln
export const equipItem = async (req, res) => {
  const { accountId, characterId, itemId, slot, category } = req.body;

  try {
    // Benutzer finden
    const user = await User.findOne({ accountId });
    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden!" });
    }

    // Charakter finden
    const character = user.characters.find(
      (char) => char.characterId === characterId
    );
    if (!character) {
      return res.status(404).json({ message: "Charakter nicht gefunden!" });
    }

    // Inventar durchsuchen
    let item;
    if (category === "weapon") {
      item = user.weaponinventory.find((weapon) => weapon.itemName === itemId);
    } else if (category === "armor") {
      item = user.armorinventory.find((armor) => armor.itemName === itemId);
    }

    if (!item) {
      return res
        .status(404)
        .json({ message: "Item nicht im Inventar gefunden!" });
    }

    // Überprüfen, ob der Slot bereits belegt ist
    if (category === "weapon" && character.equipment.weapon) {
      return res
        .status(400)
        .json({ message: "Dieser Slot ist bereits belegt!" });
    } else if (category === "armor" && character.equipment.armor[slot]) {
      return res
        .status(400)
        .json({ message: "Dieser Slot ist bereits belegt!" });
    }

    // Ausrüsten
    if (category === "weapon") {
      character.equipment.weapon = item.itemName;
      user.weaponinventory = user.weaponinventory.filter(
        (weapon) => weapon.itemName !== itemId
      );
    } else if (category === "armor" && slot) {
      character.equipment.armor[slot] = item.itemName;
      user.armorinventory = user.armorinventory.filter(
        (armor) => armor.itemName !== itemId
      );
    } else {
      return res
        .status(400)
        .json({ message: "Ungültige Kategorie oder Slot!" });
    }

    // Benutzer speichern
    await user.save();

    res.status(200).json({
      message: "Item erfolgreich ausgerüstet!",
      character,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Interner Serverfehler!" });
  }
};
