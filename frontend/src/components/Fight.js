import React from "react";
import { useLocation } from "react-router-dom";

const Fight = () => {
  const location = useLocation();
  const { userData } = location.state || {}; // Benutzerdaten, die von der Account-Seite übergeben wurden

  if (!userData) {
    return <div>Keine Benutzerdaten gefunden.</div>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#333" }}>Kampfmodus</h1>
      <h2 style={{ color: "#555" }}>Charaktere:</h2>
      <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
        {userData.characters && userData.characters.length > 0 ? (
          userData.characters.map((character, index) => (
            <li key={`character-${index}`}>
              <strong>Charaktername:</strong> {character.name} <br />
              <strong>Level:</strong> {character.level} <br />
              <strong>HP:</strong> {character.stats.hp} <br />
              <strong>Angriff:</strong> {character.stats.attack} <br />
              <strong>Verteidigung:</strong> {character.stats.defense} <br />
              <strong>Geschwindigkeit:</strong> {character.stats.speed} <br />
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
