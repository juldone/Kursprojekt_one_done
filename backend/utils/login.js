import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Ungültige Anmeldedaten" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Ungültige Anmeldedaten" });
    }

    // JWT erstellen
    const token = jwt.sign(
      { accountId: user.accountId },
      "dein-geheimer-schlüssel"
    );

    // Antwort mit Token und userName
    res.json({
      token,
      accountId: user.accountId,
      userName: user.userName, // Benutzername hinzufügen
    });
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Login", error });
  }
}
