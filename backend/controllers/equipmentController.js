import User from "../data/User.js";

// Funktion: Ausrüstung wechseln
export const equipItem = async (req, res) => {
  const { accountId, characterName, itemName, type } = req.body;

  try {
    // Benutzer finden
    const user = await User.findOne({ accountId });
    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden!" });
    }

    // Charakter finden
    const character = user.characters.find(
      (char) => char.characterName === characterName
    );
    if (!character) {
      return res.status(404).json({ message: "Charakter nicht gefunden!" });
    }

    // Inventar durchsuchen
    let item;
    if (type === "Fernkampf") {
      item = user.weaponinventory.find(
        (weapon) => weapon.itemName === itemName
      );
    } else if (
      type === "Kopf" ||
      type === "Brust" ||
      type === "Hand" ||
      type === "Füße"
    ) {
      item = user.armorinventory.find((armor) => armor.itemName === itemName);
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
    if (type === "Fernkampf") {
      character.equipment.weapon = item.itemName;
      user.weaponinventory = user.weaponinventory.filter(
        (weapon) => weapon.itemName !== itemName,
        // Hier wird ausgerüstet also müssen die stats noch auf den Char übertragen werden!!!!
        (character.stats.attack += item.damage)
      );
    } else if (type === "Kopf") {
      character.equipment.armor.head = item.itemName;
      user.armorinventory = user.armorinventory.filter(
        (armor) =>
          armor.itemName !==
          itemName(
            // Hier wird ausgerüstet also müssen die stats noch auf den Char übertragen werden!!!!
            (character.stats.armor += item.armor)
          )
      );
    } else if (type === "Brust") {
      character.equipment.armor.chest = item.itemName;
      user.armorinventory = user.armorinventory.filter(
        (armor) =>
          armor.itemName !==
          itemName(
            // Hier wird ausgerüstet also müssen die stats noch auf den Char übertragen werden!!!!
            (character.stats.armor += item.armor)
          )
      );
    } else if (type === "Hand") {
      character.equipment.armor.hands = item.itemName;
      user.armorinventory = user.armorinventory.filter(
        (armor) =>
          armor.itemName !==
          itemName(
            // Hier wird ausgerüstet also müssen die stats noch auf den Char übertragen werden!!!!
            (character.stats.armor += item.armor)
          )
      );
    } else if (type === "Füße") {
      character.equipment.armor.legs = item.itemName;
      user.armorinventory = user.armorinventory.filter(
        (armor) =>
          armor.itemName !==
          itemName(
            // Hier wird ausgerüstet also müssen die stats noch auf den Char übertragen werden!!!!
            (character.stats.armor += item.armor)
          )
      );
    } else {
      return res.status(400).json({ message: "Ungültige Kategorie!" });
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

export const unequipItem = async (req, res) => {};
