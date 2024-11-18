import React, { useEffect, useState } from "react";

const Account = () => {
  const [userData, setUserData] = useState(null); // Benutzer-Daten
  const [error, setError] = useState(null); // Fehlerzustand
  const [isCreatingCharacter, setIsCreatingCharacter] = useState(false); // Verfolgt, ob der Benutzer gerade einen Charakter erstellt
  const [newCharacterName, setNewCharacterName] = useState(""); // Name des neuen Charakters

  useEffect(() => {
    const token = localStorage.getItem("token");
    const accountId = localStorage.getItem("accountId");

    if (!token) {
      window.location.href = "/"; // Weiterleitung, wenn kein Token vorhanden ist
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/user/${accountId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error(`Fehler: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setUserData({
          username: data.username,
          accountId: data.accountId,
          materials: data.materials,
          weaponinventory: data.weaponinventory,
          armorinventory: data.armorinventory,
          characters: data.characters,
        });
      } catch (error) {
        console.error("Fehler beim Abrufen der Benutzerdaten:", error);
        setError("Daten konnten nicht geladen werden.");
      }
    };

    fetchUserData();
  }, []); // Einmalige Ausführung beim Laden des Components

  const goToCrafting = () => {
    const accountId = localStorage.getItem("accountId");
    if (accountId) {
      window.location.href = `/user/${accountId}/crafting`;
    } else {
      console.error("Account ID fehlt. Navigation zu Crafting nicht möglich.");
    }
  };

  const handleCreateCharacter = async () => {
    const token = localStorage.getItem("token");
    const accountId = localStorage.getItem("accountId");

    if (!token || !accountId || !newCharacterName) {
      console.error("Fehlende Daten für die Charaktererstellung");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/createCharacter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          accountId: accountId,
          name: newCharacterName,
          level: 1,
          stats: {
            hp: 100,
            attack: 10,
            defense: 5,
            speed: 5,
          },
          equipment: {
            armor: {
              head: "0-StatHelm",
              chest: "0-StatBrust",
              hands: "0-StatHände",
              legs: "0-StatBeine",
            },
            weapon: "0-StatWaffe",
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Fehler: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Charakter erstellt:", data.character);

      setUserData((prevData) => ({
        ...prevData,
        characters: [...prevData.characters, data.character],
      }));

      setIsCreatingCharacter(false);
      setNewCharacterName("");
    } catch (error) {
      console.error("Fehler bei der Charaktererstellung:", error);
      alert("Fehler bei der Erstellung des Charakters");
    }
  };

  const deleteCharacter = async (characterId) => {
    const token = localStorage.getItem("token");
    const accountId = localStorage.getItem("accountId");

    if (!token || !accountId) {
      console.error("Token oder AccountID fehlen.");
      return;
    }

    const isConfirmed = window.confirm(
      "Bist du sicher, dass du diesen Charakter löschen möchtest?"
    );
    if (!isConfirmed) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/user/character`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          accountId: accountId,
          characterId: characterId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Fehler: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data.message);

      setUserData((prevData) => ({
        ...prevData,
        characters: prevData.characters.filter(
          (character) => character.characterId !== characterId
        ),
      }));
    } catch (error) {
      console.error("Fehler beim Löschen des Charakters:", error);
      alert("Fehler beim Löschen des Charakters: " + error.message);
    }
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

      <h2 style={{ marginTop: "20px", color: "#555" }}>Waffen:</h2>
      <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
        {userData.weaponinventory &&
          userData.weaponinventory.map((item, index) => (
            <li key={`weapon-${index}`}>
              <strong>Waffe:</strong> {item.itemName} - {item.rarity} -{" "}
              {item.damage} Schaden
            </li>
          ))}
      </ul>
      <h2 style={{ marginTop: "20px", color: "#555" }}>Rüstung:</h2>
      <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
        {userData.armorinventory &&
          userData.armorinventory.map((item, index) => (
            <li key={`armor-${index}`}>
              <strong>Rüstung:</strong> {item.itemName} - {item.rarity} -{" "}
              {item.armor} Verteidigung
            </li>
          ))}
      </ul>

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
              <button
                style={{
                  padding: "5px 10px",
                  fontSize: "14px",
                  backgroundColor: "#ff4d4d",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={() => deleteCharacter(character.characterId)}
              >
                Charakter löschen
              </button>
            </li>
          ))
        ) : (
          <li>Keine Charaktere vorhanden.</li>
        )}
      </ul>

      {!userData.characters.length && !isCreatingCharacter && (
        <button
          onClick={() => setIsCreatingCharacter(true)}
          style={{
            padding: "5px 10px",
            fontSize: "14px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Neuen Charakter erstellen
        </button>
      )}

      {isCreatingCharacter && (
        <div style={{ marginTop: "20px" }}>
          <input
            type="text"
            value={newCharacterName}
            onChange={(e) => setNewCharacterName(e.target.value)}
            placeholder="Charaktername"
            style={{ padding: "5px", marginRight: "10px" }}
          />
          <button
            onClick={handleCreateCharacter}
            style={{
              padding: "5px 10px",
              fontSize: "14px",
              backgroundColor: "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Charakter erstellen
          </button>
        </div>
      )}
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
    </div>
  );
};

export default Account;
