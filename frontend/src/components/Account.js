import React, { useEffect, useState } from "react";

const Account = () => {
  const [userData, setUserData] = useState({
    username: localStorage.getItem("userName") || "",
  });
  const [error, setError] = useState(null); // Zustand für Fehler

  useEffect(() => {
    const token = localStorage.getItem("token");
    const accountId = localStorage.getItem("accountId");

    if (!token) {
      window.location.href = "/";
    }

    fetch(`http://localhost:3000/user/${accountId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Der Token wird korrekt im Header übergeben
      },
    })
      .then((response) => {
        if (!response.ok) {
          setError(
            `Fehler: Netzwerkantwort war nicht OK. Status: ${response.status}`
          );
          throw new Error(
            `Netzwerkantwort war nicht OK. Status: ${response.status}`
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log("Benutzerdaten aus der API-Antwort:", data);
        setUserData((prevData) => ({
          ...prevData,
          ...data,
        }));
      })
      .catch((error) => {
        console.error("Fehler beim Abrufen der Benutzerdaten:", error);
        setError("Fehler beim Abrufen der Benutzerdaten.");
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
        {userData.weaponinventory &&
          userData.weaponinventory.map((item, index) => (
            <li key={index}>
              {item.itemName} - {item.rarity} - {item.damage}
            </li>
          ))}
        {userData.armorinventory &&
          userData.armorinventory.map((item, index) => (
            <li key={index}>
              {item.itemName} - {item.rarity} - {item.damage}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Account;
