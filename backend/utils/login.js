import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../data/User.js";

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    // Benutzer suchen
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Ungültige Anmeldedaten" });
    }

    // Passwort überprüfen
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Ungültige Anmeldedaten" });
    }

    // JWT erstellen
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login erfolgreich", token });
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Login", error });
  }
}
