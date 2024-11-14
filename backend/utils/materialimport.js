import User from "../models/User.js"; // Pfad anpassen

export async function materials(req, res) {
  const { accountId, materialType, amount } = req.body;

  try {
    // Benutzer anhand der accountId suchen
    const user = await User.findOne({ accountId });
    if (!user) {
      return res.status(404).json({ error: "Benutzer nicht gefunden" });
    }

    // Material hinzufügen oder initialisieren
    if (user.materials[materialType] !== undefined) {
      user.materials[materialType] += amount;
    } else {
      user.materials[materialType] = amount;
    }

    await user.save();
    res.status(200).json({ message: "Material erfolgreich hinzugefügt", user });
  } catch (error) {
    console.error("Fehler beim Hinzufügen des Materials:", error);
    res.status(500).json({ error: "Fehler beim Hinzufügen des Materials" });
  }
}
