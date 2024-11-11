// Importiere notwendige Module
const express = require('express'); // Web-Framework für Node.js
const cors = require('cors');       // Middleware, um Cross-Origin-Anfragen zu erlauben

// Initialisiere die App
const app = express();
const port = 4000; // Der Server-Port

// Middleware
app.use(cors()); // Erlaubt Cross-Origin-Anfragen von allen Ursprüngen
app.use(express.json()); // Ermöglicht das Parsen von JSON-Daten im Request-Body

// In-Memory-Speicher für die Spielgegenstände (als Array)
let items = []; 

// 1. Route zum Erstellen eines Spielgegenstands
app.post('/items', (req, res) => {
    const { name, type, power } = req.body; // Extrahiere Eigenschaften aus dem Anfrage-Body
    const id = items.length + 1;            // Generiere eine eindeutige ID basierend auf der Array-Länge
    const newItem = { id, name, type, power }; // Erstelle das neue Item-Objekt
    items.push(newItem);                    // Füge das Objekt dem Array hinzu
    res.status(201).json(newItem);          // Sende das neu erstellte Item als JSON zurück
});

// 2. Route zum Abrufen aller Spielgegenstände
app.get('/items', (req, res) => {
    res.json(items); // Sende alle Spielgegenstände als JSON zurück
});

// 3. Route zum Abrufen eines einzelnen Gegenstands nach ID
app.get('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id);           // Hole die ID aus den URL-Parametern und konvertiere sie zu Integer
    const item = items.find(i => i.id === itemId);    // Finde das Item mit der passenden ID im Array
    if (item) {
        res.json(item);                               // Wenn gefunden, Item als JSON zurückgeben
    } else {
        res.status(404).json({ message: 'Item not found' }); // Falls nicht gefunden, 404-Fehler zurückgeben
    }
});

// 4. Route zum Aktualisieren (Aufleveln) eines Gegenstands
app.put('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id);           // Hole die ID aus den URL-Parametern
    const item = items.find(i => i.id === itemId);    // Finde das Item mit der passenden ID
    if (item) {
        const { name, type, power } = req.body;       // Hole die neuen Eigenschaften aus dem Body
        if (name) item.name = name;                   // Aktualisiere den Namen, falls vorhanden
        if (type) item.type = type;                   // Aktualisiere den Typ, falls vorhanden
        if (power) item.power = power;                // Aktualisiere die Power, falls vorhanden
        res.json(item);                               // Aktualisiertes Item zurückgeben
    } else {
        res.status(404).json({ message: 'Item not found' }); // Falls nicht gefunden, 404-Fehler zurückgeben
    }
});

// 5. Route zum Löschen eines Spielgegenstands
app.delete('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id);           // Hole die ID aus den URL-Parametern
    const index = items.findIndex(i => i.id === itemId); // Finde den Index des Items
    if (index !== -1) {
        const deletedItem = items.splice(index, 1);   // Entferne das Item aus dem Array
        res.json(deletedItem);                        // Zurückgeben des gelöschten Items
    } else {
        res.status(404).json({ message: 'Item not found' }); // Falls nicht gefunden, 404-Fehler zurückgeben
    }
});

// 6. Route für einfache "Kampf"-Mechanik
app.post('/items/:id/battle', (req, res) => {
    const itemId = parseInt(req.params.id);           // Hole die ID des Gegenstands
    const item = items.find(i => i.id === itemId);    // Finde das Item mit der passenden ID
    if (item) {
        const enemyPower = Math.floor(Math.random() * 100); // Zufällige Gegnerstärke
        if (item.power > enemyPower) {                 // Vergleiche Gegenstandsstärke mit Gegnerstärke
            res.json({ message: `Item ${item.name} gewinnt den Kampf!`, enemyPower, itemPower: item.power });
        } else {
            res.json({ message: `Item ${item.name} verliert den Kampf...`, enemyPower, itemPower: item.power });
        }
    } else {
        res.status(404).json({ message: 'Item not found' }); // Falls nicht gefunden, 404-Fehler zurückgeben
    }
});

// Server starten
app.listen(port, () => {
    console.log(`Server läuft auf Port ${port}`);
});
