// Importiere das Mongoose-Modul, um mit MongoDB-Datenbanken zu arbeiten.
import mongoose from "mongoose";

// Definiere das Schema für die Drop-Items
const dropSchema = new mongoose.Schema({
  material: { type: String, required: true },
  chance: { type: Number, required: true }, // Wahrscheinlichkeit, dass das Material gedroppt wird (0-1)
  amount: { type: [Number], required: true }, // Min. und Max. Menge des Drops
});

// Definiere das Schema für Gegner in der Datenbank
const enemySchema = new mongoose.Schema({
  enemyid: { type: Number, required: true, unique: true }, // Einzigartige ID für jeden Gegner, z.B. beginnend ab 6000
  name: { type: String, required: true }, // Name des Gegners
  level: { type: Number, default: 1 }, // Level des Gegners, standardmäßig 1

  // Objekt für die Statistiken des Gegners
  stats: {
    health: { type: Number, default: 50 }, // Lebenspunkte des Gegners
    attack: { type: Number, default: 10 }, // Angriff des Gegners
    defense: { type: Number, default: 5 }, // Verteidigungswert des Gegners
    speed: { type: Number, default: 5 }, // Geschwindigkeitswert des Gegners
  },

  // Array der möglichen Drops
  drops: { type: [dropSchema], default: [] },
});

// Erstelle und exportiere das Modell für die "Enemy"-Sammlung in MongoDB
const Enemy = mongoose.model("Enemy", enemySchema);

export default Enemy;
