import mongoose from "mongoose";

// Definiere das Schema für Charakterdokumente in der Datenbank.
const characterSchema = new mongoose.Schema({
  // Definiere das _id-Feld als Zeichenkette, die erforderlich und eindeutig ist (Charakter-ID).
  _id: { type: String, required: true, unique: true },

  // accountId: Verweist auf die ID des Benutzerkontos, das den Charakter besitzt.
  accountId: { type: String, required: [true, "Account ID ist erforderlich"] },

  // Name des Charakters, als String gespeichert und erforderlich.
  name: {
    type: String,
    required: [true, "Name des Charakters ist erforderlich"],
    minlength: [2, "Name muss mindestens 2 Zeichen lang sein"],
    maxlength: [12, "Name darf nicht länger als 12 Zeichen sein"],
  },

  // Level des Charakters mit einem Standardwert von 1, falls nicht angegeben.
  level: {
    type: Number,
    default: 1,
    min: [1, "Level muss mindestens 1 sein"],
    max: [100, "Level darf nicht mehr als 100 sein"],
  },

  // Objekt für die Statistiken (stats) des Charakters, mit Standardwerten für jeden Wert.
  stats: {
    hp: { type: Number, default: 100, min: [0, "HP darf nicht negativ sein"] }, // Lebenspunkte (Health Points) mit Standardwert 100
    attack: {
      type: Number,
      default: 10,
      min: [0, "Angriffswert darf nicht negativ sein"],
    }, // Angriffswert des Charakters mit Standardwert 10
    defense: {
      type: Number,
      default: 5,
      min: [0, "Verteidigungswert darf nicht negativ sein"],
    }, // Verteidigungswert des Charakters mit Standardwert 5
    speed: {
      type: Number,
      default: 5,
      min: [0, "Geschwindigkeitswert darf nicht negativ sein"],
    }, // Geschwindigkeitswert des Charakters mit Standardwert 5
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
