import bcrypt from "bcryptjs";
import User from "../data/User.js";
import Counter from "../data/counter.js";

export async function register(req, res) {
  try {
    const { email, password, userName } = req.body;

    // Überprüfen, ob Benutzer oder Benutzername bereits existieren
    const existingUser = await User.findOne({
      $or: [{ email }, { userName }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Benutzer oder Benutzername existiert bereits" });
    }

    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 10);

    // Erhöhe den Zähler nur, wenn der Benutzer tatsächlich angelegt wird
    const counter = await Counter.findOneAndUpdate(
      { id: "autoval" },
      { $inc: { sequenz: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // Neuen Benutzer mit der auto-incrementierten `userId` erstellen
    const user = new User({
      accountId: counter.sequenz, // Verwendung der auto-incrementierten ID
      email,
      password: hashedPassword,
      userName,
    });
    await user.save();

    res.status(201).json({ message: "Benutzer erfolgreich registriert" });
  } catch (error) {
    res.status(500).json({ message: "Fehler bei der Registrierung", error });
  }
}
