import React, { useEffect, useState } from "react";

const Account = () => {
  const [userData, setUserData] = useState(null); // Benutzer-Daten
  const [error, setError] = useState(null); // Fehlerzustand
  const [isCreatingCharacter, setIsCreatingCharacter] = useState(false); // Verfolgt, ob der Benutzer gerade einen Charakter erstellt
  const [newCharacterName, setNewCharacterName] = useState(""); // Name des neuen Charakters
  const [isWeaponsVisible, setIsWeaponsVisible] = useState(false); // Waffen ein-/ausklappen
  const [isArmorVisible, setIsArmorVisible] = useState(false); // Rüstung ein-/ausklappen
  const [selectedCharacterId, setSelectedCharacterId] = useState(null); // ID des aktuell ausgewählten Charakters

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

  const handleEquipItem = (item, type) => {
    if (!selectedCharacterId) {
      alert("Bitte wähle zuerst einen Charakter aus.");
      return;
    }

    setUserData((prevData) => {
      const updatedCharacters = prevData.characters.map((character) => {
        if (character.characterId === selectedCharacterId) {
          const updatedEquipment =
            type === "weapon"
              ? { ...character.equipment, weapon: item.itemName }
              : {
                  ...character.equipment,
                  armor: {
                    ...character.equipment.armor,
                    [item.slot]: item.itemName,
                  },
                };

          return { ...character, equipment: updatedEquipment };
        }
        return character;
      });

      return { ...prevData, characters: updatedCharacters };
    });

    alert(
      `${item.itemName} wurde dem Charakter ${
        userData.characters.find(
          (char) => char.characterId === selectedCharacterId
        ).name
      } als ${type === "weapon" ? "Waffe" : "Rüstung"} zugewiesen.`
    );
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

      <h2 style={{ marginTop: "20px", color: "#ebebeb" }}>Charaktere:</h2>
      <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
        {userData.characters && userData.characters.length > 0 ? (
          userData.characters.map((character, index) => (
            <li
              key={`character-${index}`}
              style={{
                backgroundColor:
                  selectedCharacterId === character.characterId
                    ? "#d3f9d8"
                    : "transparent",
                cursor: "pointer",
              }}
              onClick={() => setSelectedCharacterId(character.characterId)}
            >
              <strong>Charaktername:</strong> {character.name} <br />
              <strong>Level:</strong> {character.level} <br />
              <strong>HP:</strong> {character.stats.hp} <br />
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
                style={{ cursor: "pointer" }}
                onClick={() => handleEquipItem(item, "weapon")}
              >
                <strong>Waffe:</strong> {item.itemName} - {item.rarity} -{" "}
                {item.damage} Schaden
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
                style={{ cursor: "pointer" }}
                onClick={() => handleEquipItem(item, "armor")}
              >
                <strong>Rüstung:</strong> {item.itemName} - {item.rarity} -{" "}
                {item.armor} Verteidigung
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default Account;
