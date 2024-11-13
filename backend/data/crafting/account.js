// Beispiel für ein Account-Schema mit Materialbestand
import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  materials: { type: Number, required: true, default: 100 }, // Anfangsbestand an Materialien
  // Weitere Account-Felder
});

const Account = mongoose.model("Account", accountSchema);
export default Account;
