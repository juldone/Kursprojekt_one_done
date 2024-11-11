import bcrypt from "bcryptjs";
import User from "../models/user.js"; // Importiere das User-Modell
import User from "./data/User.js"; // Passe den Pfad an, wenn notwendig

export async function register(req, res) {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Benutzer existiert bereits" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "Benutzer erfolgreich registriert" });
  } catch (error) {
    res.status(500).json({ message: "Fehler bei der Registrierung", error });
  }
}
