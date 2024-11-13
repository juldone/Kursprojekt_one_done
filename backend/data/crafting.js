const mongoose = require("mongoose");

// Schema für ein Crafting-Rezept
const craftingRecipeSchema = new mongoose.Schema({
  ID: {
    type: Number,
    required: true,
    unique: true,
  },
  resultItem: {
    type: String,
    required: true, // Name des resultierenden Items
  },
  resultAmount: {
    type: Number,
    required: true, // Menge des resultierenden Items
  },
  ingredients: [
    {
      material: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Material",
        required: true, // Verweist auf ein Material
      },
      amount: {
        type: Number,
        required: true, // Menge des Materials für dieses Rezept
      },
    },
  ],
});

// Beispielrezepte - diese müssen in eine Seperate JSON Datei - diese Daten müssen in eine Datenbank importiert werden um dann in Form einer
// ID aufgerufen zu werden
const recipes = [
  {
    resultItem: "Holzbogen",
    resultAmount: 1,
    ingredients: [
      { material: "Holz", amount: 2 },
      { material: "Metal", amount: 1 },
    ],
  },
  {
    resultItem: "Steinspitzhacke",
    resultAmount: 1,
    ingredients: [
      { material: "Stein", amount: 3 },
      { material: "Metal", amount: 1 },
    ],
  },
];

// Modell exportieren
module.exports = mongoose.model("CraftingRecipe", craftingRecipeSchema);
