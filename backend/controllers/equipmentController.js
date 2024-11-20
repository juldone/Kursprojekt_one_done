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
    console.log("Suche nach Charakter:", characterName);
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

    // Ausgerüstetes Item prüfen
    let unequippedItem;
    let message;

    if (type === "Waffe") {
      console.log("Prüfung auf Waffe...");
      if (!character.equipment.weapon) {
        return res.status(400).json({
          message: "Du hast keine Waffe angelegt, die du ablegen kannst.",
        });
      }

      // Waffe ablegen
      if (type === "Waffe") {
        if (!character.equipment.weapon) {
          return res.status(400).json({
            message: "Du hast keine Waffe angelegt, die du ablegen kannst.",
          });
        }

        // Waffe kopieren und Angriffswert anpassen
        unequippedItem = { ...character.equipment.weapon };
        character.stats.attack -= unequippedItem.damage; // Angriffswert reduzieren
        character.equipment.weapon = null; // Waffenslot leeren

        // Waffe ins Inventar zurücklegen
        user.weaponinventory.push(unequippedItem);

        // Überprüfen, ob der Name der Waffe existiert, bevor er in der Nachricht verwendet wird
        const weaponName = unequippedItem.itemName || "eine unbekannte Waffe";
        message = `Du hast die Waffe "${weaponName}" abgelegt.`;

        return res.status(200).json({ message });
      }

      // Kopfrüstung ablegen
      unequippedItem = { ...character.equipment.armor.head }; // Kopfrüstung kopieren
      character.stats.defense -= unequippedItem.armor; // Verteidigungswert anpassen
      character.equipment.armor.head = null; // Ausrüstungsslot leeren
      user.armorinventory.push(unequippedItem); // Gegenstand zurück in´s Inventar ballern
      message = `Du hast die Kopfrüstung "${unequippedItem.itemName}" abgelegt.`;
    } else if (type === "Brust") {
      if (!character.equipment.armor.chest) {
        return res.status(400).json({
          message:
            "Du hast keine Brustpanzerung angelegt, die du ablegen kannst.",
        });
      }

      // Brustpanzerung ablegen
      unequippedItem = { ...character.equipment.armor.chest };
      character.stats.defense -= unequippedItem.armor;
      character.equipment.armor.chest = null;
      user.armorinventory.push(unequippedItem);
      message = `Du hast die Brustpanzerung "${unequippedItem.itemName}" abgelegt.`;
    } else if (type === "Hand") {
      if (!character.equipment.armor.hands) {
        return res.status(400).json({
          message: "Du hast keine Handschuhe angelegt, die du ablegen kannst.",
        });
      }

      // Handschuhe ablegen
      unequippedItem = { ...character.equipment.armor.hands };
      character.stats.defense -= unequippedItem.armor;
      character.equipment.armor.hands = null;
      user.armorinventory.push(unequippedItem);
      message = `Du hast die Handschuhe "${unequippedItem.itemName}" abgelegt.`;
    } else if (type === "Füße") {
      if (!character.equipment.armor.legs) {
        return res.status(400).json({
          message: "Du hast keine Fußrüstung angelegt, die du ablegen kannst.",
        });
      }

      // Fußrüstung ablegen
      unequippedItem = { ...character.equipment.armor.legs };
      character.stats.defense -= unequippedItem.armor;
      character.equipment.armor.hands = null;
      user.armorinventory.push(unequippedItem);
      message = `Du hast die Schuhe "${unequippedItem.itemName}" abgelegt.`;
    } else {
      return res
        .status(400)
        .json({
          message:
            "Digga stehst du hier drin oder oben bitte sag hier, save hier die logik hier ist noch nooby",
        });
    }

    // Benutzer speichern
    await user.save();
    console.log("Speichern erfolgreich!");

    res.status(200).json({
      message,
      character,
    });
  } catch (error) {
    console.error("Fehler im unequipItem:", error);
    res.status(500).json({ message: "Interner Serverfehler!" });
  }
};
