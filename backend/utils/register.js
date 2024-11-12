import bcrypt from "bcryptjs";
import User from "../data/User.js";
import counter from "../data/counter";
import autoincID from "../data/counter";

export async function register(req, res) {
  autoincID.findOneAndUpdate(
    { id: "autoval" },
    { $inc: { sequenz: 1 } },
    { new: true },
    (err, cd) => {
      if (cd == null) {
        const newval = new autoincID({ id: "autoval", sequenz: 1 });
        newval.save();
      }
    }
  );

  try {
    const { email, password, userName } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { userName }],
    });
    if (existingUser) {
      return res.status(400).json({ message: "Benutzer existiert bereits" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, userName });
    await user.save();

    res.status(201).json({ message: "Benutzer erfolgreich registriert" });
  } catch (error) {
    res.status(500).json({ message: "Fehler bei der Registrierung", error });
  }
}
