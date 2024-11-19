import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../data/User.js";

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

    // Standardcharakter ermitteln (erster Charakter, falls vorhanden)
    const defaultCharacter =
      user.characters.length > 0 ? user.characters[0]._id : null; // Hier nehmen wir den ersten Charakter

    // JWT erstellen
    const token = jwt.sign(
      { accountId: user.accountId },
      "dein-geheimer-schlüssel"
    );

    // Antwort mit Token, accountId, userName und characterId
    res.json({
      token,
      accountId: user.accountId,
      userName: user.userName, // Benutzername hinzufügen
      characterId: defaultCharacter, // Standard-Charakter-ID hinzufügen
    });
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Login", error });
  }
}
