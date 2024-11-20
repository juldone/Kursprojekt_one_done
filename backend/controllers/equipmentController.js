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

    // Überprüfen, ob der Slot bereits belegt ist
    // if (type === "Waffe" && character.equipment.weapon) {
    //   return res
    //     .status(400)
    //     .json({ message: "Dieser Slot ist bereits belegt!" });
    // } else if (type === "armor" && character.equipment.armor) {
    //   return res
    //     .status(400)
    //     .json({ message: "Dieser Slot ist bereits belegt!" });
    // }

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

// Beginn Ausrüstung Ablegen Funktion
export const unequipItem = async (req, res) => {
  const { accountId, characterName, type } = req.body;

  try {
    // Benutzer finden
    const user = await User.findOne({ accountId });
    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden!" });
    }

    console.log("Benutzer gefunden:", user);

    // Charakter finden
    const character = user.characters.find(
      (char) => char.name === characterName
    );

    if (!character) {
      console.log(
        "Charakter nicht gefunden! Verfügbare Charaktere:",
        user.characters
      );
      return res.status(404).json({ message: "Charakter nicht gefunden!" });
    }

    console.log("Charakter gefunden:", character);

    // Hilfsfunktion zum Ablegen von Ausrüstungsgegenständen
    const unequipArmor = (slot) => {
      const armorItem = character.equipment.armor[slot];
      if (!armorItem) {
        return {
          status: 400,
          message: `Du hast keine ${slot}-Rüstung angelegt, die du ablegen kannst.`,
        };
      }

      character.stats.defense -= armorItem.armor; // Verteidigungswert anpassen
      character.equipment.armor[slot] = null; // Slot leeren
      user.armorinventory.push(armorItem); // Zurück ins Inventar legen
      return {
        status: 200,
        message: `Du hast die ${slot}-Rüstung "${armorItem.itemName}" abgelegt.`,
      };
    };

    // Waffenprüfung und Ablegen
    let unequippedItem, message;
    if (type === "Waffe") {
      console.log("Prüfung auf Waffe...");
      if (!character.equipment.weapon) {
        return res
          .status(400)
          .json({
            message: "Du hast keine Waffe angelegt, die du ablegen kannst.",
          });
      }

      unequippedItem = { ...character.equipment.weapon };
      character.stats.attack -= unequippedItem.damage; // Angriffswert reduzieren
      character.equipment.weapon = null; // Waffenslot leeren
      user.weaponinventory.push(unequippedItem);

      const weaponName = unequippedItem.itemName || "eine unbekannte Waffe";
      message = `Du hast die Waffe "${weaponName}" abgelegt.`;
    } else {
      // Überprüfen, ob der Typ eine Rüstung ist
      const armorSlots = ["head", "chest", "hands", "legs"];
      if (armorSlots.includes(type)) {
        const result = unequipArmor(type); // Passende Rüstung ablegen
        if (result.status !== 200) {
          return res.status(result.status).json({ message: result.message });
        }
        message = result.message;
      } else {
        return res
          .status(400)
          .json({ message: "Ungültiger Ausrüstungs-Typ angegeben." });
      }
    }

    // Benutzer speichern
    await user.save();
    console.log("Speichern erfolgreich!");

    res.status(200).json({ message, character });
  } catch (error) {
    console.error("Fehler im unequipItem:", error);
    res.status(500).json({ message: "Interner Serverfehler!" });
  }
};
