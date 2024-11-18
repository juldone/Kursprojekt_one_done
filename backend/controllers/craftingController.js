// Exportiert die Funktion craftItem aus diesem Modul
export async function craftItem(userId, itemName) {
  try {
    // Sucht den Benutzer anhand der Benutzer-ID in der Datenbank
    const user = await User.findById(userId);
    if (!user) {
      // Wenn der Benutzer nicht gefunden wird, gibt es eine Fehlermeldung
      return { success: false, message: "Benutzer nicht gefunden" };
    }

    let item, itemType; // Variablen für das Item und seinen Typ (Waffe oder Rüstung)
    let isWeapon = false; // Flag, um zu prüfen, ob es sich bei dem Item um eine Waffe handelt

    // Überprüfen, ob das Item eine Waffe oder eine Rüstung ist
    if (weapons[itemName]) {
      // Wenn der Name des Items in den Waffen-Daten vorhanden ist
      item = weapons[itemName]; // Setze das Item als Waffe
      itemType = "weapon"; // Setze den Item-Typ auf "weapon"
      isWeapon = true; // Setze das Flag für Waffen auf true
    } else if (Armor[itemName]) {
      // Wenn der Name des Items in den Rüstungs-Daten vorhanden ist
      item = Armor[itemName]; // Setze das Item als Rüstung
      itemType = "armor"; // Setze den Item-Typ auf "armor"
    } else {
      return { success: false, message: "Item nicht gefunden" }; // Wenn das Item weder eine Waffe noch eine Rüstung ist
    }

    // Überprüfen, ob der Benutzer genügend Materialien für das Crafting hat
    const hasMaterials = checkMaterials(user.materials, item.materialCost);
    if (!hasMaterials) {
      // Wenn der Benutzer nicht genug Materialien hat
      return { success: false, message: "Deine Materialien reichen nicht aus" };
    }

    // Materialien vom Benutzer abziehen
    user.materials = deductMaterials(user.materials, item.materialCost);

    // Bestimmen der Rarität des Items (die Rarität wird mit einer zufälligen Chance-Tabelle festgelegt)
    const rarity = getRandomRarity(); // Ruft die Funktion zur Bestimmung der Rarität auf

    // Erstellen des gecrafteten Items basierend auf den Item-Daten und der Rarität
    const craftedItem = createCraftingItem({
      result: itemName, // Das Ergebnis ist der Name des Items
      type: itemType, // Der Typ des Items (Waffe oder Rüstung)
      attack: isWeapon ? item.attack : 0, // Falls es eine Waffe ist, wird der Angriffswert gesetzt, andernfalls 0
      defense: !isWeapon ? item.defense : 0, // Falls es keine Waffe (also eine Rüstung) ist, wird der Verteidigungswert gesetzt
      recipe: item.materialCost, // Die Materialkosten des Items
    });

    // Das neu gecraftete Item wird dem Benutzer-Inventar hinzugefügt, zusammen mit der Rarität
    user.inventory.push({ itemName: craftedItem.name, rarity });

    // Speichern der Benutzer-Daten (damit die Änderungen im Inventar und den Materialien persistiert werden)
    await user.save();

    // Erfolgreiche Rückmeldung mit dem gecrafteten Item und der Rarität
    return {
      success: true,
      message: `Du hast ein ${craftedItem.name} von Qualität ${rarity} hergestellt!`,
      item: craftedItem, // Rückgabe des gecrafteten Items
    };
  } catch (error) {
    // Fehlerbehandlung, falls beim Craften ein Fehler auftritt
    console.error("Fehler beim Craften:", error); // Fehlerprotokollierung in der Konsole
    return { success: false, message: "Fehler beim Craften des Items" }; // Rückgabe einer Fehlermeldung
  }
}
