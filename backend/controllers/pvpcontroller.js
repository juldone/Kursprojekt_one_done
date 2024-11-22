import User from "../data/User.js";
import connectDB from "../db.js";
import mongoose from "mongoose";

async function getRandomAccountId() {
  try {
    const count = await User.countDocuments();
    if (count === 0) throw new Error("Keine Benutzer in der Datenbank");

    const randomIndex = Math.floor(Math.random() * count);

    const result = await User.aggregate([
      { $skip: randomIndex }, // Überspringe zufällige Dokumente
      { $limit: 1 }, // Begrenze die Ergebnisse auf 1
      { $project: { accountId: 1, _id: 0 } }, // Nur accountId zurückgeben
    ]);

    return result[0]?.accountId || null;
  } catch (error) {
    console.error("Fehler beim Abrufen einer zufälligen accountId:", error);
    return null;
  }
}

// Hauptfunktion
(async () => {
  await connectDB();
  const accountId = await getRandomAccountId();
  console.log("Zufällige accountId:", accountId);
  mongoose.connection.close();
})();
