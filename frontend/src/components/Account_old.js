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
          inventory: data.inventory,
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
    setNewCharacterId(`char_${Date.now()}`); // Generiere ID, wenn Formular geöffnet wird
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
            <p>Char_ID: {char.id}</p>
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
          <button onClick={handleShowCreateForm}>Create Character</button>
        </div>
      )}

      {showCreateForm && (
        <div>
          <h3>Neuen Charakter erstellen</h3>
          <input
            type="text"
            placeholder="Charaktername"
            value={newCharacterName}
            onChange={(e) => setNewCharacterName(e.target.value)}
          />
          <p>Automatisch vergebene ID: {newCharacterId}</p>
          <button onClick={handleCreateCharacter}>Charakter erstellen</button>
          <button onClick={() => setShowCreateForm(false)}>Abbrechen</button>
        </div>
      )}
    </div>
  );
};

export default Account;
