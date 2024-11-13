// Importiere das Mongoose-Modul, um mit MongoDB-Datenbanken zu arbeiten.
import mongoose from "mongoose";

// Definiere das Schema für Charakterdokumente in der Datenbank.
const characterSchema = new mongoose.Schema({
  // Definiere das _id-Feld als Zeichenkette, die erforderlich und eindeutig ist (Charakter-ID).
  _id: { type: String, required: true, unique: true },

  // accountId: Verweist auf die ID des Benutzerkontos, das den Charakter besitzt.
  accountId: { type: String, required: true }, // Verweis auf die Account-ID

  // Name des Charakters, als String gespeichert und erforderlich.
  name: { type: String, required: true },

  // Level des Charakters mit einem Standardwert von 1, falls nicht angegeben.
  level: { type: Number, default: 1 },

  // Objekt für die Statistiken (stats) des Charakters, mit Standardwerten für jeden Wert.
  stats: {
    hp: { type: Number, default: 100 }, // Lebenspunkte (Health Points) mit Standardwert 100
    attack: { type: Number, default: 10 }, // Angriffswert des Charakters mit Standardwert 10
    defense: { type: Number, default: 5 }, // Verteidigungswert des Charakters mit Standardwert 5
    speed: { type: Number, default: 5 }, // Geschwindigkeitswert des Charakters mit Standardwert 5
  },

  // Objekt für die Ausrüstung (equipment) des Charakters, unterteilt in Rüstung und Waffen.
  equipment: {
    armor: {
      head: { type: String, default: null }, // Kopf-Rüstungsteil des Charakters, standardmäßig null (keine Rüstung)
      chest: { type: String, default: null }, // Brust-Rüstungsteil des Charakters, standardmäßig null
      hands: { type: String, default: null }, // Handschuh-Rüstungsteil des Charakters, standardmäßig null
      legs: { type: String, default: null }, // Bein-Rüstungsteil des Charakters, standardmäßig null
    },
    weapon: { type: String, default: null }, // Waffe des Charakters, standardmäßig null (keine Waffe)
  },
});

// Erstelle und exportiere das Modell für die "Character"-Sammlung (Collection) in MongoDB,
// um Dokumente gemäß dem characterSchema in der Datenbank zu speichern.
const Character = mongoose.model("Character", characterSchema);

export default Character;
