import mongoose from "mongoose";
import { craftItem } from "../controllers/craftingController.js"; // Den Pfad zu deinem Controller anpassen
import User from "../models/User.js"; // Den Pfad zu deinem User-Modell anpassen
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Hol den Pfad des aktuellen Moduls
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Verbindung zur MongoDB herstellen
async function connectToDatabase() {
  await mongoose.connect("mongodb://localhost/testDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

// Testdaten für den Benutzer
async function createTestUser() {
  const testUser = new User({
    username: "TestUser",
    materials: {
      Holz: 100,
      Eisen: 50,
      Leder: 30,
    },
    inventory: [],
  });

  await testUser.save();
  return testUser;
}

// Testfunktion für das Craften eines Items
async function testCraftItem() {
  await connectToDatabase();
  const user = await createTestUser();

  // Versuche, ein Schwert zu craften (Stelle sicher, dass "Schwert der Zerstörung" in der Waffen-JSON vorhanden ist)
  const result = await craftItem(user._id, "Schwert der Zerstörung");

  console.log(result.message);
  console.log("Neues Inventar:", user.inventory);

  // Benutzer nach dem Craften neu laden, um Materialien zu überprüfen
  const updatedUser = await User.findById(user._id);
  console.log("Aktuelle Materialien:", updatedUser.materials);
}

// Test ausführen und sicherstellen, dass die Verbindung danach geschlossen wird
testCraftItem()
  .then(() => mongoose.disconnect())
  .catch((error) => {
    console.error("Fehler beim Testen:", error);
    mongoose.disconnect();
  });
