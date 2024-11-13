// Importiere das CraftingItem-Modell, um auf Crafting-Gegenstände in der Datenbank zuzugreifen
import CraftingItem from "./craftingItem.js";

// Importiere das Account-Modell, um auf Account-Daten in der Datenbank zuzugreifen
// Dies ist ein Beispiel für ein Schema, das den Kontobestand eines Nutzers speichern könnte
import Account from "./account.js";

// Exportiere eine asynchrone Funktion namens craftItem, die den Crafting-Prozess ausführt
// Die Funktion nimmt zwei Parameter: accountId (ID des Accounts) und itemId (ID des zu erstellenden Gegenstands)
export const craftItem = async (accountId, itemId) => {
  try {
    // Finde den Crafting-Gegenstand mit der übergebenen itemId in der Datenbank
    const item = await CraftingItem.findById(itemId);

    // Finde den Account des Benutzers mit der übergebenen accountId in der Datenbank
    const account = await Account.findById(accountId);

    // Überprüfe, ob der Account genügend Materialien hat, um den Gegenstand zu erstellen
    if (account.materials < item.cost) {
      // Wenn der Kontostand an Materialien niedriger ist als die Kosten des Gegenstands, wirf einen Fehler
      throw new Error("Nicht genügend Materialien");
    }

    // Ziehe die Materialkosten des Gegenstands vom Account ab
    account.materials -= item.cost;

    // Speichere die aktualisierten Daten des Accounts in der Datenbank
    await account.save();

    // Gebe ein Erfolgsobjekt zurück, das den Namen des erstellten Gegenstands enthält
    return { success: true, item: item.name };
  } catch (error) {
    // Falls ein Fehler auftritt, gebe ein Fehlerobjekt zurück, das die Fehlermeldung enthält
    return { success: false, error: error.message };
  }
};
