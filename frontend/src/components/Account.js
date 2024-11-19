import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate korrekt importieren

const Account = () => {
  const [userData, setUserData] = useState(null); // User-Daten
  const [error, setError] = useState(null); // Fehlerzustand
  const navigate = useNavigate(); // useNavigate korrekt benutzen

  useEffect(() => {
    const token = localStorage.getItem("token");
    const accountId = localStorage.getItem("accountId");

    if (!token) {
      window.location.href = "/"; // Weiterleitung wenn kein Token vorhanden ist
      return;
    }

    fetch(`http://localhost:3000/user/${accountId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Fehler: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("API-Daten:", data); // Debug: Alle API-Daten loggen

        setUserData({
          username: data.username,
          accountId: data.accountId,
          materials: data.materials,
          weaponinventory: data.weaponinventory,
          armorinventory: data.armorinventory,
          characters: data.characters, // Füge Charaktere zu den Daten hinzu
        });
      })
      .catch((error) => {
        console.error("Fehler beim Abrufen der Benutzerdaten:", error);
        setError("Daten konnten nicht geladen werden.");
      });
  }, []); // Die leere Abhängigkeitsliste sorgt dafür, dass der Effekt nur einmal beim Initialisieren des Components ausgeführt wird

  const goToCrafting = () => {
    const accountId = localStorage.getItem("accountId");
    if (accountId) {
      navigate(`/user/${accountId}/crafting`); // Navigation mit navigate
    } else {
      console.error("Account ID fehlt. Navigation zu Crafting nicht möglich.");
    }
  };

  const goToFight = () => {
    navigate("/Fight"); // Navigation zur Fight-Seite mit navigate
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#333" }}>Account Information</h1>
      <p>Account ID: {userData.accountId}</p>
      <p>Benutzername: {userData.username}</p>

      <h2 style={{ marginTop: "20px", color: "#555" }}>Materialien:</h2>
      <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
        {userData.materials && (
          <>
            <li>Holz: {userData.materials.Holz || 0}</li>
            <li>Stein: {userData.materials.Stein || 0}</li>
            <li>Metall: {userData.materials.Metall || 0}</li>
          </>
        )}
      </ul>

      <h2 style={{ marginTop: "20px", color: "#555" }}>Inventar:</h2>
      <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
        {userData.weaponinventory &&
          userData.weaponinventory.map((item, index) => (
            <li key={`weapon-${index}`}>
              <strong>Waffe:</strong> {item.itemName} - {item.rarity} -{" "}
              {item.damage} Schaden
            </li>
          ))}
        {userData.armorinventory &&
          userData.armorinventory.map((item, index) => (
            <li key={`armor-${index}`}>
              <strong>Rüstung:</strong> {item.itemName} - {item.rarity} -{" "}
              {item.defense} Verteidigung
            </li>
          ))}
      </ul>

      {/* Anzeige der Charaktere */}
      <h2 style={{ marginTop: "20px", color: "#555" }}>Charaktere:</h2>
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
              <strong>Waffe:</strong> {character.equipment.weapon} <br />
              <strong>Rüstung:</strong>
              <ul>
                <li>Helm: {character.equipment.armor.head}</li>
                <li>Brustpanzer: {character.equipment.armor.chest}</li>
                <li>Handschuhe: {character.equipment.armor.hands}</li>
                <li>Beinschützer: {character.equipment.armor.legs}</li>
              </ul>
            </li>
          ))
        ) : (
          <li>Keine Charaktere vorhanden</li>
        )}
      </ul>

      <button
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          borderRadius: "5px",
          border: "none",
          backgroundColor: "#1e90ff",
          color: "#fff",
          cursor: "pointer",
          marginTop: "20px",
        }}
        onClick={goToCrafting}
      >
        Crafting
      </button>

      {/* GoToFight Button */}
      <button
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          borderRadius: "5px",
          border: "none",
          backgroundColor: "#ff6347",
          color: "#fff",
          cursor: "pointer",
          marginTop: "20px",
        }}
        onClick={goToFight}
      >
        GoToFight
      </button>
    </div>
  );
};

export default Account;
