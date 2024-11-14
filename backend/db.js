import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("Datenbankverbindung bereits aktiv.");
      return;
    }
    await mongoose.connect("mongodb://localhost:27017/BaJutTi", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Verbindung zur Datenbank hergestellt");
  } catch (error) {
    console.error("Fehler bei der Verbindung zur Datenbank:", error);
    process.exit(1); // Beendet den Prozess, falls die Verbindung fehlschlägt
  }
};

// Funktion zum Beenden der Datenbankverbindung
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log("Verbindung zur Datenbank geschlossen");
  } catch (error) {
    console.error("Fehler beim Schließen der Datenbankverbindung:", error);
  }
};

export default connectDB;
