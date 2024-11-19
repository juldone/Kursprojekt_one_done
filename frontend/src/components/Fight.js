import React from "react";
import { useLocation } from "react-router-dom";

const Fight = () => {
  const location = useLocation();
  const { userData } = location.state || {}; // Benutzerdaten, die von der Account-Seite übergeben wurden

  console.log("Location State:", location.state);
  console.log("User Data:", userData);

  if (!userData) {
    return (
      <div>
        Keine Benutzerdaten gefunden. Bitte gehe zurück und wähle einen
        Charakter aus.
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#333" }}>Kampfmodus</h1>
      <h2 style={{ color: "#555" }}>Charaktere:</h2>
      <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
        {Array.isArray(userData.characters) &&
        userData.characters.length > 0 ? (
          userData.characters.map((character, index) => (
            <li key={`character-${index}`}>
              <strong>Charaktername:</strong> {character.name || "N/A"} <br />
              <strong>Level:</strong> {character.level || "N/A"} <br />
              <strong>HP:</strong> {character.stats?.hp || "N/A"} <br />
              <strong>Angriff:</strong> {character.stats?.attack || "N/A"}{" "}
              <br />
              <strong>Verteidigung:</strong> {character.stats?.defense || "N/A"}{" "}
              <br />
              <strong>Geschwindigkeit:</strong>{" "}
              {character.stats?.speed || "N/A"} <br />
            </li>
          ))
        ) : (
          <li>Keine Charaktere vorhanden</li>
        )}
      </ul>
    </div>
  );
};

export default Fight;
