import React, { useEffect, useState } from "react";

const Account = () => {
  const [userData, setUserData] = useState(null); // User-Daten
  const [characters, setCharacters] = useState([]); // Charakterliste
  const [error, setError] = useState(null); // Fehlerzustand
  const [showCreateForm, setShowCreateForm] = useState(false); // Formularanzeige
  const [newCharacterName, setNewCharacterName] = useState(""); // Name des neuen Charakters
  const [newCharacterId, setNewCharacterId] = useState(""); // ID des neuen Charakters

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
        });

        // Setzen der Charaktere basierend auf den Daten von der API
        if (data.characters && Array.isArray(data.characters)) {
          console.log("Charaktere aus der API:", data.characters); // Debugging: Charaktere loggen
          setCharacters(data.characters); // setze die Charaktere aus den API-Daten
        } else {
          console.log("Keine Charaktere gefunden");
          setCharacters([]); // Sicherstellen, dass der State ein leeres Array ist, wenn keine Charaktere vorhanden sind
        }
      })
      .catch((error) => {
        console.error("Fehler beim Abrufen der Benutzerdaten:", error);
        setError("Daten konnten nicht geladen werden.");
      });
  }, []); // Die leere Abhängigkeitsliste sorgt dafür, dass der Effekt nur einmal beim Initialisieren des Components ausgeführt wird

  const handleCreateCharacter = () => {
    const token = localStorage.getItem("token");
    const accountId = localStorage.getItem("accountId");

    if (!accountId || !token || !newCharacterName) {
      setError("Bitte Namen eingeben.");
      return;
    }

    // Überprüfen, ob bereits ein Charakter existiert
    if (characters.length > 0) {
      setError("Du hast bereits einen Charakter!");
      return;
    }

    fetch(`http://localhost:3000/createCharacter`, {
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
          weapon: "Basis-Schwert",
          armor: {
            head: "Basis-Helm",
            chest: "Basis-Brustpanzer",
            hands: "Basis-Handschuhe",
            legs: "Basis-Beinschützer",
          },
        },
        characterId: newCharacterId,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Charakter konnte nicht erstellt werden.");
        }
        return response.json();
      })
      .then((newCharacter) => {
        console.log("Neuer Charakter erstellt:", newCharacter);
        setCharacters([newCharacter]); // Setzen des neuen Charakters
        setShowCreateForm(false);
        setNewCharacterName("");
        setNewCharacterId("");
      })
      .catch((error) => {
        console.error("Fehler beim Erstellen des Charakters:", error);
        setError("Charakter konnte nicht erstellt werden.");
      });
  };

  const handleShowCreateForm = () => {
    setShowCreateForm(true);
    setNewCharacterId(`char_${Date.now()}`);
  };

  const goToFight = () => {
    window.location.href = "/fight";
  };

  const goToCrafting = () => {
    window.location.href = "/crafting";
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

      <h2 style={{ marginTop: "20px", color: "#555" }}>Charaktere:</h2>
      {characters.length > 0 ? (
        characters.map((char) => (
          <div
            key={char.characterId}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              borderRadius: "5px",
              marginTop: "10px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h3 style={{ color: "#333" }}>{char.name}</h3>
            <p>Charakter ID: {char.characterId}</p>
            <p>Level: {char.level}</p>
            <p>Stats:</p>
            <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
              <li>HP: {char.stats.hp}</li>
              <li>Angriff: {char.stats.attack}</li>
              <li>Verteidigung: {char.stats.defense}</li>
              <li>Geschwindigkeit: {char.stats.speed}</li>
            </ul>
            <p>Ausrüstung:</p>
            <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
              <li>Waffe: {char.equipment.weapon}</li>
              <li>Rüstung:</li>
              <ul>
                <li>Kopf: {char.equipment.armor.head}</li>
                <li>Brust: {char.equipment.armor.chest}</li>
                <li>Hände: {char.equipment.armor.hands}</li>
                <li>Beine: {char.equipment.armor.legs}</li>
              </ul>
            </ul>
          </div>
        ))
      ) : (
        <div>
          <p style={{ color: "#888" }}>
            Du hast keinen Charakter, klicke auf neuen Charakter erstellen
          </p>
          <button style={buttonStyle} onClick={handleShowCreateForm}>
            Charakter erstellen
          </button>
        </div>
      )}

      {characters.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <button style={buttonStyle} onClick={goToFight}>
            Go to Fight
          </button>
          <button
            style={{ ...buttonStyle, marginLeft: "10px" }}
            onClick={goToCrafting}
          >
            Crafting
          </button>
        </div>
      )}

      {showCreateForm && (
        <div
          style={{
            marginTop: "20px",
            border: "1px solid #ddd",
            padding: "15px",
            borderRadius: "5px",
            backgroundColor: "#1e90ff",
          }}
        >
          <h3 style={{ color: "#555" }}>Neuen Charakter erstellen</h3>
          <input
            type="text"
            placeholder="Charaktername"
            value={newCharacterName}
            onChange={(e) => setNewCharacterName(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              marginBottom: "10px",
              display: "block",
              width: "100%",
              boxSizing: "border-box",
            }}
          />
          <p>Automatisch vergebene ID: {newCharacterId}</p>
          <button style={buttonStyle} onClick={handleCreateCharacter}>
            Erstellen
          </button>
        </div>
      )}
    </div>
  );
};

const buttonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  borderRadius: "5px",
  border: "none",
  backgroundColor: "#1e90ff",
  color: "#fff",
  cursor: "pointer",
  marginTop: "10px",
};

export default Account;
