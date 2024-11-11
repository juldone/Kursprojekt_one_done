require('dotenv').config(); // Lädt Umgebungsvariablen aus .env
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path'); // Fehlt im Originalcode

const app = express();
app.use(express.json());

// MongoDB-Verbindung herstellen
const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error("MongoDB URI nicht gefunden. Bitte in der .env Datei setzen.");
    process.exit(1); // Stoppt den Server, wenn die URI nicht vorhanden ist
}

mongoose.connect(uri)
.then(() => console.log("MongoDB verbunden"))
.catch((error) => console.error("MongoDB Verbindungsfehler:", error));

// Benutzer-Schema und -Modell
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Registrierungs-Route
app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Überprüfen, ob der Benutzer bereits existiert
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Benutzer existiert bereits' });

        // Passwort verschlüsseln
        const hashedPassword = await bcrypt.hash(password, 10);

        // Benutzer erstellen und speichern
        const user = new User({ email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'Benutzer erfolgreich registriert' });
    } catch (error) {
        res.status(500).json({ message: 'Fehler bei der Registrierung', error });
    }
});

// Login-Route
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Benutzer suchen
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Ungültige Anmeldedaten' });

        // Passwort überprüfen
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Ungültige Anmeldedaten' });

        // JWT erstellen
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login erfolgreich', token });
    } catch (error) {
        res.status(500).json({ message: 'Fehler beim Login', error });
    }
});

// Geschützte Route
app.get('/protected', (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: 'Zugriff verweigert. Kein Token gefunden.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ message: 'Zugriff auf geschützte Route gewährt', userId: decoded.userId });
    } catch (error) {
        res.status(401).json({ message: 'Ungültiges Token' });
    }
});

// Statische Dateien aus dem Ordner "public" bereitstellen
app.use(express.static(path.join(__dirname, 'public')));

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});
