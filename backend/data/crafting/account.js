// Importiere das Mongoose-Modul, um mit MongoDB zu interagieren
import mongoose from "mongoose";

// Definiere ein Schema für das Account-Modell mit Mongoose
// Dieses Schema legt die Struktur für die Account-Dokumente in der MongoDB-Datenbank fest
const accountSchema = new mongoose.Schema({
  // Materialien-Feld: Speichert die Menge an Materialien, die der Account besitzt
  // Der Typ ist eine Zahl, das Feld ist erforderlich, und der Standardwert ist 100
  materials: { type: Number, required: true, default: 100 },

  // Hier könnten weitere Felder für den Account definiert werden (z.B. Benutzername, Level, etc.)
  // Diese Felder sind hier nur als Hinweis angegeben und können je nach Bedarf hinzugefügt werden
});

// Erstelle ein Modell aus dem Schema mit dem Namen "Account"
// Das Modell ermöglicht es uns, mit Account-Dokumenten in der MongoDB-Datenbank zu arbeiten
const Account = mongoose.model("Account", accountSchema);

// Exportiere das Account-Modell, damit es in anderen Dateien verwendet werden kann
export default Account;
