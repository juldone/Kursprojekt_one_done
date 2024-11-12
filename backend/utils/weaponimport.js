// Import der JSON-Daten
const weaponData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "weapons.json"))
);

// Speichern der Waffen-Daten in der MongoDB
Weapon.insertMany(weaponData)
  .then((docs) => {
    console.log("Waffen erfolgreich importiert:", docs);
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Fehler beim Importieren der Waffen:", err);
  });
