import mongoose from "mongoose";

// Definieren des Mongoose-Schemas für die Ausrüstungsgegenstände
const itemSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["headgear", "chestarmor", "pants", "shoes"], // Definiert den Typ des Items
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  attributes: {
    strength: { type: Number, default: 0 },
    agility: { type: Number, default: 0 },
    intelligence: { type: Number, default: 0 },
  },
  rarity: {
    type: String,
    enum: ["common", "uncommon", "rare", "epic", "legendary"],
    required: true,
  },
  price: { type: Number, required: true },
});

// Erstellen von Items als Beispiel
const itemsData = [
  // Kopfbedeckungen
  {
    type: "headgear",
    name: "Ritterhelm",
    attributes: { strength: 10, agility: 2, intelligence: 0 },
    rarity: "epic",
    price: 500,
  },
  {
    type: "headgear",
    name: "Zaubererhut",
    attributes: { strength: 0, agility: 5, intelligence: 15 },
    rarity: "rare",
    price: 300,
  },
  {
    type: "headgear",
    name: "Jägerkappe",
    attributes: { strength: 5, agility: 10, intelligence: 3 },
    rarity: "uncommon",
    price: 150,
  },

  // Brustpanzerungen
  {
    type: "chestarmor",
    name: "Ritterrüstung",
    attributes: { strength: 20, agility: 3, intelligence: 0 },
    rarity: "legendary",
    price: 800,
  },
  {
    type: "chestarmor",
    name: "Robe",
    attributes: { strength: 0, agility: 7, intelligence: 12 },
    rarity: "rare",
    price: 400,
  },
  {
    type: "chestarmor",
    name: "Lederrüstung",
    attributes: { strength: 15, agility: 6, intelligence: 2 },
    rarity: "uncommon",
    price: 250,
  },

  // Hosen
  {
    type: "pants",
    name: "Ritterhose",
    attributes: { strength: 12, agility: 4, intelligence: 0 },
    rarity: "epic",
    price: 350,
  },
  {
    type: "pants",
    name: "Stoffhose",
    attributes: { strength: 0, agility: 5, intelligence: 8 },
    rarity: "rare",
    price: 200,
  },
  {
    type: "pants",
    name: "Lederhose",
    attributes: { strength: 10, agility: 8, intelligence: 1 },
    rarity: "uncommon",
    price: 150,
  },

  // Schuhe
  {
    type: "shoes",
    name: "Ritterschuhe",
    attributes: { strength: 8, agility: 6, intelligence: 0 },
    rarity: "legendary",
    price: 400,
  },
  {
    type: "shoes",
    name: "Sandalen",
    attributes: { strength: 0, agility: 12, intelligence: 3 },
    rarity: "uncommon",
    price: 100,
  },
  {
    type: "shoes",
    name: "Lederstiefel",
    attributes: { strength: 6, agility: 9, intelligence: 1 },
    rarity: "rare",
    price: 250,
  },
];

// Modell erstellen
const Item = mongoose.model("Item", itemSchema);

// Alle Items in die Datenbank einfügen
const insertItems = async () => {
  try {
    // Alle Items in der Datenbank einfügen (nur einmalig oder falls nicht vorhanden)
    const items = await Item.insertMany(itemsData);
    console.log("Items wurden erfolgreich in die Datenbank eingefügt:", items);
  } catch (error) {
    console.error("Fehler beim Einfügen der Items:", error);
  }
};

insertItems(); // Diese Funktion wird aufgerufen, um die Items zu speichern

export { Item, insertItems };
