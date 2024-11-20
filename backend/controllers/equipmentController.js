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

    // Charakter finden mit erweitertem Debugging
    console.log("Debugging beginnt:");
    console.log("Gesuchter Charaktername (aus Request):", characterName);
    console.log(
      "Alle Charaktere im User-Objekt:",
      JSON.stringify(user.characters, null, 2)
    );

    // Schritt-für-Schritt-Überprüfung
    user.characters.forEach((char, index) => {
      console.log(`Charakter ${index + 1}:`);
      console.log(`Name: "${char.name}"`);
      console.log(
        `Vergleich mit "${characterName}":`,
        char.name === characterName
      );
      console.log(
        `toLowerCase Vergleich: "${char.name.toLowerCase()}" === "${characterName.toLowerCase()}":`,
        char.name.toLowerCase() === characterName.toLowerCase()
      );
      console.log(
        `Trim Vergleich: "${char.name.trim()}" === "${characterName.trim()}":`,
        char.name.trim() === characterName.trim()
      );
    });

    // Charakter suchen
    const character = user.characters.find(
      (char) =>
        char.name.trim().toLowerCase() === characterName.trim().toLowerCase()
    );

    if (!character) {
      console.log("Charakter nicht gefunden! Debugging abgeschlossen.");
      console.log("Gesuchter Charaktername:", characterName);
      console.log(
        "Alle Charaktere im User-Objekt:",
        JSON.stringify(user.characters, null, 2)
      );

      return res.status(404).json({ message: "Charakter nicht gefunden!" });
    }

    // Erfolgsmeldung
    console.log("Charakter gefunden:", JSON.stringify(character, null, 2));

    // Inventar durchsuchen
    let item;
    if (type === "Waffe") {
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

    // Ausrüsten
    if (type === "Waffe") {
      character.equipment.weapon = item.itemName;
      user.weaponinventory = user.weaponinventory.filter(
        (weapon) => weapon.itemName !== itemName,
        // Hier wird ausgerüstet also müssen die stats noch auf den Char übertragen werden!!!!
        (character.stats.attack += item.damage)
      );
    } else if (type === "Kopf") {
      character.equipment.armor.head = item.itemName;
      user.armorinventory = user.armorinventory.filter(
        (armor) => armor.itemName !== itemName,
        // Hier wird ausgerüstet also müssen die stats noch auf den Char übertragen werden!!!!
        (character.stats.defense += item.armor)
      );
    } else if (type === "Brust") {
      character.equipment.armor.chest = item.itemName;
      user.armorinventory = user.armorinventory.filter(
        (armor) => armor.itemName !== itemName,
        // Hier wird ausgerüstet also müssen die stats noch auf den Char übertragen werden!!!!
        (character.stats.defense += item.armor)
      );
    } else if (type === "Hand") {
      character.equipment.armor.hands = item.itemName;
      user.armorinventory = user.armorinventory.filter(
        (armor) => armor.itemName !== itemName,
        // Hier wird ausgerüstet also müssen die stats noch auf den Char übertragen werden!!!!
        (character.stats.defense += item.armor)
      );
    } else if (type === "Füße") {
      character.equipment.armor.legs = item.itemName;
      user.armorinventory = user.armorinventory.filter(
        (armor) => armor.itemName !== itemName,
        // Hier wird ausgerüstet also müssen die stats noch auf den Char übertragen werden!!!!
        (character.stats.defense += item.armor)
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
export const unequipItem = async (req, res) => {
  const { accountId, characterName, itemName, type } = req.body;

  try {
    // Benutzer finden
    const user = await User.findOne({ accountId });
    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden!" });
    }

    // Charakter suchen
    const character = user.characters.find(
      (char) =>
        char.name.trim().toLowerCase() === characterName.trim().toLowerCase()
    );

    if (!character) {
      return res.status(404).json({ message: "Charakter nicht gefunden!" });
    }

    let unequippedItem;

    // Unequip Waffe
    if (type === "Waffe" && character.equipment.weapon === itemName) {
      unequippedItem = {
        itemName: character.equipment.weapon,
        type: "Waffe",
        damage: character.stats.attack, // Schaden wird basierend auf der Waffe übernommen
        rarity: "common", // Falls eine Rarität gespeichert ist, kann diese dynamisch ergänzt werden
      };

      // Stats anpassen
      character.stats.attack -= unequippedItem.damage;

      // Waffe ins Inventar zurücklegen
      user.weaponinventory.push(unequippedItem);

      // Ausrüstung entfernen
      character.equipment.weapon = null;

      // Unequip Rüstung
    } else if (type === "Kopf" && character.equipment.armor.head === itemName) {
      unequippedItem = {
        itemName: character.equipment.armor.head,
        type: "Kopf",
        armor: character.stats.defense,
        rarity: "common",
      };

      character.stats.defense -= unequippedItem.armor;
      user.armorinventory.push(unequippedItem);
      character.equipment.armor.head = null;
    } else if (
      type === "Brust" &&
      character.equipment.armor.chest === itemName
    ) {
      unequippedItem = {
        itemName: character.equipment.armor.chest,
        type: "Brust",
        armor: character.stats.defense,
        rarity: "common",
      };

      character.stats.defense -= unequippedItem.armor;
      user.armorinventory.push(unequippedItem);
      character.equipment.armor.chest = null;
    } else if (
      type === "Hand" &&
      character.equipment.armor.hands === itemName
    ) {
      unequippedItem = {
        itemName: character.equipment.armor.hands,
        type: "Hand",
        armor: character.stats.defense,
        rarity: "common",
      };

      character.stats.defense -= unequippedItem.armor;
      user.armorinventory.push(unequippedItem);
      character.equipment.armor.hands = null;
    } else if (type === "Füße" && character.equipment.armor.legs === itemName) {
      unequippedItem = {
        itemName: character.equipment.armor.legs,
        type: "Füße",
        armor: character.stats.defense,
        rarity: "common",
      };

      character.stats.defense -= unequippedItem.armor;
      user.armorinventory.push(unequippedItem);
      character.equipment.armor.legs = null;
    } else {
      return res
        .status(400)
        .json({ message: "Ungültiger Typ oder Item nicht gefunden!" });
    }

    // Benutzer speichern
    await user.save();

    res.status(200).json({
      message: "Item erfolgreich unequipped und ins Inventar zurückgelegt!",
      unequippedItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Interner Serverfehler!" });
  }
};
