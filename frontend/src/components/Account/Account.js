import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate korrekt importieren
import "./Account.css";
const Account = () => {
  const [userData, setUserData] = useState(null); // Benutzer-Daten
  const [error, setError] = useState(null); // Fehlerzustand
  const [isCreatingCharacter, setIsCreatingCharacter] = useState(false); // Verfolgt, ob der Benutzer gerade einen Charakter erstellt
  const [newCharacterName, setNewCharacterName] = useState(""); // Name des neuen Charakters
  const [isWeaponsVisible, setIsWeaponsVisible] = useState(false); // Waffen ein-/ausklappen
  const [isArmorVisible, setIsArmorVisible] = useState(false); // Rüstung ein-/ausklappen
  const navigate = useNavigate(); // useNavigate korrekt benutzen

  useEffect(() => {
    // Füge die Klasse zu body hinzu
    document.body.classList.add("mainpage-background");

    // Bereinigung nach Verlassen der Seite
    return () => {
      document.body.classList.remove("mainpage-background");
    };
  }, []);

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

  const equipItem = async (characterName, itemName, type) => {
    const token = localStorage.getItem("token");
    const accountId = localStorage.getItem("accountId");

    if (!token || !accountId) {
      console.error("Token oder Account ID fehlen.");
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
          accountId: accountId,
          characterName: characterName,
          itemName: itemName,
          type: type, // Kann "Waffe", "Kopf", "Brust", etc. sein
        }),
      });
      if (!response.ok) {
        throw new Error(`Fehler: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Erfolgreich ausgerüstet:", data.message);

      // Optional: Charakterdaten aktualisieren
      setUserData((prevData) => ({
        ...prevData,
        characters: prevData.characters.map((char) =>
          char.name === characterName
            ? { ...char, equipment: data.character.equipment }
            : char
        ),
      }));
    } catch (error) {
      console.error("Fehler beim Ausrüsten des Items:", error);
      alert("Fehler beim Ausrüsten des Items.");
    }
  };

  const unequipItem = async (characterName, itemName, type) => {
    const token = localStorage.getItem("token");
    const accountId = localStorage.getItem("accountId");

    try {
      // Anfrage an das Backend senden
      const response = await fetch("http://localhost:3000/equipment/unequip", {
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

      const data = await response.json();

      // Prüfen, ob die Anfrage erfolgreich war
      if (!response.ok) {
        throw new Error(data.message || "Fehler beim Unequippen");
      }

      // Zustand des Benutzers aktualisieren
      setUserData((prevData) => {
        const updatedCharacters = prevData.characters.map((char) => {
          // Finde den passenden Charakter und aktualisiere das Equipment
          if (char.name === characterName) {
            return {
              ...char,
              equipment: {
                ...char.equipment,
                [type]: null, // Slot wird geleert
              },
            };
          }
          return char;
        });

        // Unequippte Gegenstände zum richtigen Inventar hinzufügen
        const updatedInventory =
          type === "Waffe"
            ? {
                weaponinventory: [
                  ...prevData.weaponinventory,
                  data.unequippedItem,
                ],
              }
            : ["Kopf", "Brust", "Hand", "Füße"].includes(type)
            ? {
                armorinventory: [
                  ...prevData.armorinventory,
                  data.unequippedItem,
                ],
              }
            : {}; // Falls der Typ nicht passt, bleibt das Inventar unverändert

        return {
          ...prevData,
          characters: updatedCharacters,
          ...updatedInventory,
        };
      });

      console.log(`Item "${itemName}" wurde erfolgreich unequippt.`);
    } catch (error) {
      console.error("Fehler beim Unequippen:", error);
    }
  };

  const goToCrafting = () => {
    const accountId = localStorage.getItem("accountId");
    if (accountId) {
      navigate(`/user/${accountId}/crafting`); // Navigation mit navigate
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

  const goToFight = () => {
    navigate("/battle"); // Navigation zur Fight-Seite mit navigate
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "##fffaf0" }}>Account Information</h1>
      <p>Account ID: {userData.accountId}</p>
      <p>Benutzername: {userData.username}</p>
      <p>Materialien:</p>
      <ul>
        {userData.materials && (
          <>
            <li>Holz: {userData.materials.Holz || 0}</li>
            <li>Stein: {userData.materials.Stein || 0}</li>
            <li>Metall: {userData.materials.Metall || 0}</li>
          </>
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
              <li key={`weapon-${index}`}>
                <strong>Waffe:</strong> {item.itemName} - {item.type} -{" "}
                {item.rarity} - {item.damage} Schaden
                <button
                  onClick={() => {
                    equipItem(
                      userData.characters[0].name,
                      item.itemName,
                      "Waffe"
                    );
                    const updatedInventory = userData.weaponinventory.filter(
                      (weapon) => weapon.itemName !== item.itemName
                    );
                    const updatedCharacter = { ...userData.characters[0] };
                    updatedCharacter.equipment.weapon = item.itemName;
                    updatedCharacter.stats.attack += item.damage;
                    console.log(item.damage);
                    setUserData({
                      ...userData,
                      weaponinventory: updatedInventory,
                      characters: [updatedCharacter],
                    });
                  }}
                  style={{
                    padding: "5px 10px",
                    fontSize: "14px",
                    backgroundColor: "green",
                    color: "#222",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginLeft: "10px",
                  }}
                >
                  Ausrüsten
                </button>
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
              <li key={`armor-${index}`}>
                <strong>Rüstung:</strong> {item.itemName} -{" "}
                {item.type === "Kopf"
                  ? "Kopf"
                  : item.type === "Brust"
                  ? "Brust"
                  : item.type === "Hand"
                  ? "Hände"
                  : item.type === "Füße"
                  ? "Füße"
                  : "Unbekannt"}{" "}
                - {item.rarity} - {item.armor} Verteidigung
                <button
                  style={{
                    padding: "5px 10px",
                    fontSize: "14px",
                    backgroundColor: "green",
                    color: "#222",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginLeft: "10px",
                  }}
                  onClick={() => {
                    equipItem(
                      userData.characters[0].name,
                      item.itemName,
                      item.type
                    );
                    const updatedInventory = userData.armorinventory.filter(
                      (armor) => armor.itemName !== item.itemName
                    );
                    const updatedCharacter = { ...userData.characters[0] };
                    updatedCharacter.equipment.armor[item.type] = item.itemName;
                    updatedCharacter.stats.defense += item.armor;
                    console.log(item.armor);
                    setUserData({
                      ...userData,
                      armorinventory: updatedInventory,
                      characters: [updatedCharacter],
                    });
                  }}
                >
                  Ausrüsten
                </button>
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
              <strong>Waffe:</strong> {character.equipment.weapon}
              {character.equipment.weapon && (
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
                  onClick={() => {
                    unequipItem(
                      character.name,
                      character.equipment.weapon,
                      "Waffe"
                    );
                    const updatedInventory = [...userData.weaponinventory];
                    const updatedCharacter = { ...character };
                    updatedCharacter.equipment.weapon = null;
                    updatedCharacter.stats.attack -=
                      updatedCharacter.stats.attack;
                    console.log(updatedCharacter.stats.attack);

                    setUserData({
                      ...userData,
                      weaponinventory: updatedInventory,
                      characters: [updatedCharacter],
                    });
                  }}
                >
                  Waffe ablegen
                </button>
              )}
              <br />
              <strong>Rüstung:</strong>
              <ul>
                {character.equipment.armor.head && (
                  <li>
                    Helm: {character.equipment.armor.head}
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
                      onClick={() => {
                        unequipItem(
                          character.name,
                          character.equipment.armor.head,
                          "Kopf"
                        );
                        const updatedInventory = [...userData.armorinventory];
                        const updatedCharacter = { ...character };
                        updatedCharacter.equipment.armor.head = null;
                        updatedCharacter.stats.defense -=
                          updatedCharacter.stats.defense;
                        setUserData({
                          ...userData,
                          armorinventory: updatedInventory,
                          characters: [updatedCharacter],
                        });
                      }}
                    >
                      Helm ablegen
                    </button>
                  </li>
                )}
                {character.equipment.armor.chest && (
                  <li>
                    Brust: {character.equipment.armor.chest}
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
                      onClick={() => {
                        unequipItem(
                          character.name,
                          character.equipment.armor.chest,
                          "Brust"
                        );
                        const updatedInventory = [...userData.armorinventory];
                        const updatedCharacter = { ...character };
                        updatedCharacter.equipment.armor.chest = null;
                        updatedCharacter.stats.defense -=
                          updatedCharacter.stats.defense;
                        setUserData({
                          ...userData,
                          armorinventory: updatedInventory,
                          characters: [updatedCharacter],
                        });
                      }}
                    >
                      Brust ablegen
                    </button>
                  </li>
                )}
                {character.equipment.armor.hands && (
                  <li>
                    Handschuhe: {character.equipment.armor.hands}
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
                      onClick={() => {
                        unequipItem(
                          character.name,
                          character.equipment.armor.hands,
                          "Hand"
                        );
                        const updatedInventory = [...userData.armorinventory];
                        const updatedCharacter = { ...character };
                        updatedCharacter.equipment.armor.hands = null;
                        updatedCharacter.stats.defense -=
                          updatedCharacter.stats.defense;
                        setUserData({
                          ...userData,
                          armorinventory: updatedInventory,
                          characters: [updatedCharacter],
                        });
                      }}
                    >
                      Handschuhe ablegen
                    </button>
                  </li>
                )}
                {character.equipment.armor.legs && (
                  <li>
                    Füße: {character.equipment.armor.legs}
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
                      onClick={() => {
                        unequipItem(
                          character.name,
                          character.equipment.armor.legs,
                          "Füße"
                        );
                        const updatedInventory = [...userData.armorinventory];
                        const updatedCharacter = { ...character };
                        updatedCharacter.equipment.armor.legs = null;
                        updatedCharacter.stats.defense -=
                          updatedCharacter.stats.defense;
                        setUserData({
                          ...userData,
                          armorinventory: updatedInventory,
                          characters: [updatedCharacter],
                        });
                      }}
                    >
                      Füße ablegen
                    </button>
                  </li>
                )}
                {/* Weitere Rüstungsteile wie oben wiederholen */}
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

      {/* Button für das Erstellen eines neuen Charakters */}
      {!userData.characters.length && !isCreatingCharacter && (
        <button
          onClick={() => setIsCreatingCharacter(true)}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#FF5733", // Farbiger Button
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "20px",
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
