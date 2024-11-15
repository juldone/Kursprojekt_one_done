import React, { useEffect, useState } from "react";

const Account = () => {
  const [userData, setUserData] = useState({
    username: localStorage.getItem("userName") || "",
  });
  const [characters, setCharacters] = useState([]);
  const [error, setError] = useState(null); // Zustand für Fehler
  const [showCreateForm, setShowCreateForm] = useState(false); // Zustand für das Erstellungsformular
  const [newCharacterName, setNewCharacterName] = useState(""); // Zustand für den Namen des neuen Charakters
  const [newCharacterId, setNewCharacterId] = useState(""); // Zustand für die ID des neuen Charakters

  useEffect(() => {
    const token = localStorage.getItem("token");
    const accountId = localStorage.getItem("accountId");

    if (!token) {
      window.location.href = "/";
      return;
    }

    // Abruf von Benutzerdaten inklusive Charaktere
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
          inventory: data.inventory,
        });
        setCharacters(data.characters || []); // Setzt die Charaktere
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

    // Generieren einer einzigartigen ID für den Charakter
    const characterId = `char_${Date.now()}`;

    // API-Aufruf zum Erstellen eines neuen Charakters
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
        characterId: characterId, // Automatisch vergebene ID
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Charakter konnte nicht erstellt werden.");
        }
        return response.json();
      })
      .then((newCharacter) => {
        // Aktualisieren der Charakterliste
        setCharacters((prevCharacters) => [...prevCharacters, newCharacter]);
        setShowCreateForm(false); // Verstecke das Formular nach der Erstellung
        setNewCharacterName(""); // Leere den Namenszustand
      })
      .catch((error) => {
        console.error("Fehler beim Erstellen des Charakters:", error);
        setError("Charakter konnte nicht erstellt werden.");
      });
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Account Information</h1>
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
      <h2>Inventar:</h2>
      <ul>
        {userData.inventory &&
          userData.inventory.map((item, index) => (
            <li key={index}>
              {item.itemName} - {item.rarity}
            </li>
          ))}
      </ul>
      <h2>Charaktere:</h2>
      {characters.length ? (
        characters.map((char) => (
          <div key={char.id}>
            <h3>{char.name}</h3>
            <p>ID: {char.id}</p>
            <p>Level: {char.level}</p>
            <p>Stats:</p>
            <ul>
              <li>HP: {char.stats.hp}</li>
              <li>Angriff: {char.stats.attack}</li>
              <li>Verteidigung: {char.stats.defense}</li>
              <li>Geschwindigkeit: {char.stats.speed}</li>
            </ul>
            <p>Ausrüstung:</p>
            <ul>
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
          <p>Keine Charaktere gefunden.</p>
          <button onClick={() => setShowCreateForm(true)}>
            Create Character
          </button>
        </div>
      )}

      {/* Erstellungsformular für einen neuen Charakter */}
      {showCreateForm && (
        <div>
          <h3>Neuen Charakter erstellen</h3>
          <input
            type="text"
            placeholder="Charaktername"
            value={newCharacterName}
            onChange={(e) => setNewCharacterName(e.target.value)}
          />
          <p>
            Automatisch vergebene ID: {newCharacterId || `char_${Date.now()}`}
          </p>
          <button onClick={handleCreateCharacter}>Charakter erstellen</button>
          <button onClick={() => setShowCreateForm(false)}>Abbrechen</button>
        </div>
      )}
    </div>
  );
};

export default Account;
