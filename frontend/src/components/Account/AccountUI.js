import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate korrekt importieren
import AccountUI from "./AccountUI"; // Neue Komponente nach Auslagern von JSX Teil
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

 export default Account;
