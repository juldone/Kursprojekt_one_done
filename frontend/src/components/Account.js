import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [isCreatingCharacter, setIsCreatingCharacter] = useState(false);
  const [newCharacterName, setNewCharacterName] = useState("");
  const [isWeaponsVisible, setIsWeaponsVisible] = useState(false);
  const [isArmorVisible, setIsArmorVisible] = useState(false);
  const navigate = useNavigate();

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
    try {
      // Suche den Charakter basierend auf characterName
      const character = userData.characters.find(
        (character) => character.name === characterName
      );

      if (!character) {
        console.log(character);
        alert("Charakter nicht gefunden!");
        return;
      }

      // Suche das Item im Inventar, das den itemName und type übereinstimmt
      const selectedItem =
        type === "Waffe"
          ? userData.weaponinventory.find(
              (item) => item.itemName === itemName && item.type === type
            )
          : userData.armorinventory.find(
              (item) => item.itemName === itemName && item.type === type
            );

      if (!selectedItem) {
        alert("Item nicht gefunden!");
        return;
      }

      // Sende das ausgewählte Item an das Backend
      const response = await fetch("http://localhost:3000/equipment/equip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountId: accountId,
          characterName: character.name, // Hier den richtigen Namen übergeben
          itemName: selectedItem.itemName, // Nur itemName übergeben
          type: selectedItem.type, // Den Typ des Items übergeben
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(
          data.message ||
            `${
              type === "Waffe" ? "Waffe" : "Rüstung"
            } wurde erfolgreich ausgerüstet!`
        );

        // Erfolgreiches Ausrüsten – Update der Charakterdaten im Frontend
        setUserData((prevData) => {
          const updatedCharacters = prevData.characters.map((character) => {
            if (character.name === characterName) {
              const updatedEquipment = { ...character.equipment };

              if (type === "Waffe") {
                updatedEquipment.weapon = selectedItem.itemName;
                character.stats.attack += selectedItem.damage; // Stat-Wert anpassen
              } else if (
                type === "Kopf" ||
                type === "Brust" ||
                type === "Hand" ||
                type === "Füße"
              ) {
                updatedEquipment.armor[type.toLowerCase()] =
                  selectedItem.itemName;
                character.stats.defense += selectedItem.armor; // Stat-Wert anpassen
              }

              return { ...character, equipment: updatedEquipment };
            }
            return character;
          });

          return { ...prevData, characters: updatedCharacters };
        });
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Fehler beim Ausrüsten des Items.");
      }
    } catch (error) {
      console.error("Fehler beim Senden der Anfrage:", error);
      alert("Es gab einen Fehler beim Kommunizieren mit dem Backend.");
    }
  };

  const goToCrafting = () => {
    const accountId = localStorage.getItem("accountId");
    if (accountId) {
      navigate(`/user/${accountId}/crafting`);
    } else {
      console.error("Account ID fehlt. Navigation zu Crafting nicht möglich.");
    }
  };

  const goToFight = () => {
    navigate("/battle");
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
              <li
                key={`weapon-${index}`}
                style={{ listStyle: "none", marginBottom: "10px" }}
              >
                <button
                  onClick={() => {
                    // Prüfen, ob der Index innerhalb der verfügbaren Charaktere liegt
                    if (userData.characters) {
                      // Hier übergibst du das characterId, itemName und type
                      equipItem(
                        userData.accountId, // characterId
                        userData.characters.name, // characterName
                        item.itemName, // itemName
                        item.type // type
                      );
                    } else {
                      alert(
                        "Kein Charakter verfügbar, um die Waffe auszurüsten."
                      );
                    }
                  }}
                  style={{
                    padding: "5px 10px",
                    fontSize: "14px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    backgroundColor: "#4CAF50", // Standardfarbe: Grün
                    color: "#fff",
                    transition:
                      "background-color 0.3s ease, transform 0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#45a049")
                  } // Dunkler Grün beim Hover
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#4CAF50")
                  } // Zurück zu Standardgrün
                  onMouseDown={(e) =>
                    (e.target.style.transform = "scale(0.95)")
                  } // Klickanimation
                  onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
                >
                  {item.itemName}
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
              <li
                key={`armor-${index}`}
                style={{ listStyle: "none", marginBottom: "10px" }}
              >
                <button
                  onClick={() => {
                    if (userData.characters.length > 0) {
                      equipItem(
                        userData.characters[0].characterId,
                        item,
                        "armor"
                      );
                    } else {
                      alert(
                        "Kein Charakter verfügbar, um die Rüstung auszurüsten."
                      );
                    }
                  }}
                  style={{
                    padding: "5px 10px",
                    fontSize: "14px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    backgroundColor: "#1E90FF", // Standardfarbe: Blau
                    color: "#fff",
                    transition:
                      "background-color 0.3s ease, transform 0.2s ease",
                  }}
                  onMouseEnter={
                    (e) => (e.target.style.backgroundColor = "#1C86EE") // Dunkler Blau beim Hover
                  }
                  onMouseLeave={
                    (e) => (e.target.style.backgroundColor = "#1E90FF") // Zurück zu Standardblau
                  }
                  onMouseDown={(e) =>
                    (e.target.style.transform = "scale(0.95)")
                  } // Klickanimation
                  onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
                >
                  {item.itemName}
                </button>
                <span style={{ marginLeft: "10px" }}>
                  <strong>Rarität:</strong> {item.rarity} -{" "}
                  <strong>Verteidigung:</strong> {item.armor}
                </span>
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
              <strong>Waffe:</strong>{" "}
              {character.equipment.weapon || "Keine Waffe angelegt"} <br />
              <strong>Rüstung:</strong>
              <ul>
                <li>Helm: {character.equipment.armor.head || "Keine"}</li>
                <li>
                  Brustpanzer: {character.equipment.armor.chest || "Keine"}
                </li>
                <li>
                  Handschuhe: {character.equipment.armor.hands || "Keine"}
                </li>
                <li>
                  Beinschützer: {character.equipment.armor.legs || "Keine"}
                </li>
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
                onClick={() => {
                  if (window.confirm("Charakter wirklich löschen?")) {
                    setUserData((prevData) => ({
                      ...prevData,
                      characters: prevData.characters.filter(
                        (c) => c.characterId !== character.characterId
                      ),
                    }));
                  }
                }}
              >
                Charakter löschen
              </button>
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
