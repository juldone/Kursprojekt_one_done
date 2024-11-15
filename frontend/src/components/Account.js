import React, { useEffect, useState } from "react";

const Account = () => {
  const [userData, setUserData] = useState({
    username: localStorage.getItem("userName") || "",
  });
  const [characters, setCharacters] = useState([]);
  const [error, setError] = useState(null); // Zustand für Fehler

  useEffect(() => {
    const token = localStorage.getItem("token");
    const accountId = localStorage.getItem("accountId");

    if (!token) {
      window.location.href = "/";
    }

    // Abruf von Benutzerdaten
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
        setUserData((prevData) => ({
          ...prevData,
          ...data,
        }));
      })
      .catch((error) => {
        console.error("Fehler beim Abrufen der Benutzerdaten:", error);
        setError("Benutzerdaten konnten nicht geladen werden.");
      });

    // Abruf von Charakterdaten
    fetch(`http://localhost:3000/user/${accountId}/characters`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Fehler: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setCharacters(data);
      })
      .catch((error) => {
        console.error("Fehler beim Abrufen der Charakterdaten:", error);
        setError("Charakterdaten konnten nicht geladen werden.");
      });
  }, []);

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
        <p>Keine Charaktere gefunden.</p>
      )}
    </div>
  );
};

export default Account;
