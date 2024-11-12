const mongoose = require("mongoose");

// Schema für Materialien, die man pro Kampf erhalten kann
const materialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  minAmount: {
    type: Number,
    required: true,
  },
  maxAmount: {
    type: Number,
    required: true,
  },
});

// Beispielmaterialien (zum Testen)
const materials = [
  {
    name: "Holz",
    description: "Ein paar Holzbretter",
    minAmount: 1,
    maxAmount: 4,
  },
  {
    name: "Stein",
    description: "Ein paar solide Steine",
    minAmount: 1,
    maxAmount: 2,
  },
  {
    name: "Metal",
    description: "Teile einer Rüstung",
    minAmount: 0,
    maxAmount: 1,
  },
];

module.exports = mongoose.model("Material", materialSchema);
