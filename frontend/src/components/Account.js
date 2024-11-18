import React, { useEffect, useState } from "react";

const Account = () => {
  const [userData, setUserData] = useState({
    username: localStorage.getItem("userName") || "",
  });
  const [characters, setCharacters] = useState([]);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCharacterName, setNewCharacterName] = useState("");
  const [newCharacterId, setNewCharacterId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const accountId = localStorage.getItem("accountId");

    if (!token) {
      window.location.href = "/";
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
        setUserData({
          username: data.username,
          accountId: data.accountId,
          materials: data.materials,
          weaponinventory: data.weaponinventory,
          armorinventory: data.armorinventory,
        });
        setCharacters(data.characters || []);
      })
      .catch((error) => {
        console.error("Fehler beim Abrufen der Benutzerdaten:", error);
        setError("Daten konnten nicht geladen werden.");
      });
  }, []);

  const handleCreateCharacter = () => {
    const token = localStorage.getItem("token");
    const accountId = localStorage.getItem("accountId");

    if (!accountId || !token || !newCharacterName) {
      setError("Bitte Namen eingeben.");
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
        setCharacters((prevCharacters) => [...prevCharacters, newCharacter]);
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
    // Navigation zur Kampfseite
    window.location.href = "/fight";
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
      <h2>Inventar:</h2>
      <h2 style={{ marginTop: "20px", color: "#555" }}>Inventar:</h2>
      <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
        {/* Waffen-Inventar */}
        {userData.weaponinventory &&
          userData.weaponinventory.map((item, index) => (
            <li key={`weapon-${index}`}>
              <strong>Waffe:</strong> {item.itemName} - {item.rarity} -{" "}
              {item.damage} Schaden
            </li>
          ))}

        {/* Rüstungs-Inventar */}
        {userData.armorinventory &&
          userData.armorinventory.map((item, index) => (
            <li key={`armor-${index}`}>
              <strong>Rüstung:</strong> {item.itemName} - {item.rarity} -{" "}
              {item.defense} Verteidigung
            </li>
          ))}
      </ul>
      <h2 style={{ marginTop: "20px", color: "#555" }}>Charaktere:</h2>
      {characters.length ? (
        characters.map((char) => (
          <div
            key={char.id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              borderRadius: "5px",
              marginTop: "10px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h3 style={{ color: "#333" }}>{char.name}</h3>
            <p>Char_ID: {char.id}</p>
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
          <p style={{ color: "#888" }}>Keine Charaktere gefunden.</p>
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
          <div style={{ display: "flex", gap: "10px" }}>
            <button style={buttonStyle} onClick={handleCreateCharacter}>
              Charakter erstellen
            </button>
            <button
              style={buttonStyle}
              onClick={() => setShowCreateForm(false)}
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}

      <button
        style={{
          ...buttonStyle,
          marginTop: "20px",
          backgroundColor: "#1e90ff",
          color: "#fff",
        }}
        onClick={() => window.history.back()}
      >
        Zurück
      </button>
    </div>
  );
};

const buttonStyle = {
  padding: "10px 15px",
  border: "none",
  borderRadius: "5px",
  backgroundColor: "#ddd",
  color: "#333",
  fontSize: "16px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  textAlign: "center",
};

buttonStyle[":hover"] = {
  backgroundColor: "#ccc",
};

export default Account;
