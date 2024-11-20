import React, { useEffect, useState } from "react";

const Account = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [isCreatingCharacter, setIsCreatingCharacter] = useState(false);
  const [newCharacterName, setNewCharacterName] = useState("");
  const [isWeaponsVisible, setIsWeaponsVisible] = useState(false);
  const [isArmorVisible, setIsArmorVisible] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const accountId = localStorage.getItem("accountId");

    if (!token) {
      window.location.href = "/";
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
  }, []);

  const equipItem = async (accountId, characterName, itemName, type) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Kein Token vorhanden.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/equipment/equip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          accountId,
          characterName,
          itemName,
          type,
        }),
      });

      if (!response.ok) {
        throw new Error(`Fehler: ${response.status} ${response.statusText}`);
      }

      const updatedCharacter = await response.json();
      console.log("Gegenstand ausgerüstet:", updatedCharacter);

      setUserData((prevData) => ({
        ...prevData,
        characters: prevData.characters.map((char) =>
          char.characterName === characterName ? updatedCharacter : char
        ),
      }));
    } catch (error) {
      console.error("Fehler beim Ausrüsten des Gegenstands:", error);
      alert("Fehler beim Ausrüsten des Gegenstands");
    }
  };

  const goToCrafting = () => {
    const accountId = localStorage.getItem("accountId");
    if (accountId) {
      window.location.href = `/user/${accountId}/crafting`;
    } else {
      console.error("Account ID fehlt. Navigation zu Crafting nicht möglich.");
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

      <h2
        style={{ marginTop: "20px", color: "#ebebeb", cursor: "pointer" }}
        onClick={() => setIsWeaponsVisible((prev) => !prev)}
      >
        Waffen: {isWeaponsVisible ? "▼" : "▶"}
      </h2>
      {isWeaponsVisible && (
        <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
          {userData.weaponinventory &&
            userData.weaponinventory.map((item, index) => (
              <li
                key={`weapon-${index}`}
                onClick={() =>
                  equipItem(item, "weapon", userData.characters[0].characterId)
                }
                style={{ cursor: "pointer", color: "#007bff" }}
              >
                <strong>Waffe:</strong> {item.itemName} - {item.type} -{" "}
                {item.rarity} - {item.damage} Schaden
              </li>
            ))}
        </ul>
      )}

      <h2
        style={{ marginTop: "20px", color: "#ebebeb", cursor: "pointer" }}
        onClick={() => setIsArmorVisible((prev) => !prev)}
      >
        Rüstung: {isArmorVisible ? "▼" : "▶"}
      </h2>
      {isArmorVisible && (
        <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
          {userData.armorinventory &&
            userData.armorinventory.map((item, index) => (
              <li
                key={`armor-${index}`}
                onClick={() =>
                  equipItem(item, "armor", userData.characters[0].characterId)
                }
                style={{ cursor: "pointer", color: "#007bff" }}
              >
                <strong>Rüstung:</strong> {item.itemName} - {item.type} -{" "}
                {item.rarity} - {item.armor} Verteidigung
              </li>
            ))}
        </ul>
      )}

      <h2 style={{ marginTop: "20px", color: "#ebebeb" }}>Charaktere:</h2>
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
          <li>Keine Charaktere vorhanden.</li>
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
    </div>
  );
};

export default Account;
