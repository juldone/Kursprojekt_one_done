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
});

// Beispielmaterialien (zum Testen) - Müssen in eine seperate JSON-Datei, diese Daten müssen in eine Datenbank importiert werden um dann in Form einer
// ID aufgerufen zu werden
const materials = [
  {
    name: "Holz",
    description: "Ein paar Holzbretter",
  },
  {
    name: "Stein",
    description: "Ein paar solide Steine",
  },
  {
    name: "Metal",
    description: "Teile einer Rüstung",
  },
];

module.exports = mongoose.model("Material", materialSchema);
