import React, { useState, useEffect } from "react";

const BattleArena = ({
  characterId: propCharacterId,
  accountId: propAccountId,
}) => {
  // Lokale States für Character und Account-IDs
  const [characterId, setCharacterId] = useState(null);
  const [accountId, setAccountId] = useState(null);

  // Abrufen der characterId und accountId aus dem localStorage beim ersten Laden
  useEffect(() => {
    const storedCharacterId = localStorage.getItem("characterId");
    const storedAccountId = localStorage.getItem("accountId");

    // Wenn die Props nicht existieren, versuche, sie aus dem localStorage zu holen
    if (!propCharacterId && storedCharacterId) {
      setCharacterId(storedCharacterId);
    } else {
      setCharacterId(propCharacterId);
    }

    if (!propAccountId && storedAccountId) {
      setAccountId(storedAccountId);
    } else {
      setAccountId(propAccountId);
    }
  }, [propCharacterId, propAccountId]);

  // Wenn characterId oder accountId sich ändern, speichern wir sie im localStorage
  useEffect(() => {
    if (characterId) {
      localStorage.setItem("characterId", characterId);
    }
    if (accountId) {
      localStorage.setItem("accountId", accountId);
    }
  }, [characterId, accountId]);

  const [player, setPlayer] = useState({
    name: "",
    hp: 0,
    maxHp: 0,
    attack: 0,
    defense: 0,
  });
  const [enemy, setEnemy] = useState({
    name: "",
    hp: 0,
    maxHp: 0,
    attack: 0,
    defense: 0,
  });
  const [battleLog, setBattleLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fightInProgress, setFightInProgress] = useState(false);
  const [error, setError] = useState(null); // Zustand für Fehler

  useEffect(() => {
    const fetchBattleData = async () => {
      const token = localStorage.getItem("token"); // Hol dir den Token aus dem localStorage
      if (!token) {
        setError("Kein Token gefunden, bitte logge dich erneut ein.");
        setLoading(false);
        return;
      }

      // Überprüfen, ob die IDs existieren
      if (!characterId || !accountId) {
        setError("Fehlende Charakter- oder Account-ID.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/battle", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // JWT-Token im Header
          },
          body: JSON.stringify({ characterId, accountId }),
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Nicht autorisiert. Bitte logge dich erneut ein.");
          }
          throw new Error(`HTTP-Fehler: ${response.status}`);
        }

        const data = await response.json();

        // Konsolenausgabe für die API-Antwort (Zur Überprüfung der erhaltenen Daten)
        console.log(data.charactersName); // Der Name des Charakters
        console.log(data.enemyName); // Der Name des Gegners
        console.log(data.message); // Die Nachricht des Kampfes
        console.log("Antwort von der API:", data);

        // Überprüfen, ob die erwarteten Felder existieren
        if (data.character && data.enemy) {
          setPlayer({
            name: data.character.name || "Unbekannter Spieler", // Fallback für null oder undefined
            hp: data.character.stats.hp,
            maxHp: data.character.stats.hp,
            attack: data.character.stats.attack,
            defense: data.character.stats.defense,
          });

          setEnemy({
            name: data.enemy.name || "Unbekannter Gegner", // Fallback für null oder undefined
            hp: data.enemy.stats.health,
            maxHp: data.enemy.stats.health,
            attack: data.enemy.stats.attack,
            defense: data.enemy.stats.defense,
          });
          setBattleLog(["Der Kampf hat begonnen!"]);
        } else {
          console.error(
            "Fehlende oder ungültige 'name' Felder in der Antwort:",
            data
          );
          setError("Die API-Antwort enthält nicht die erwarteten Daten.");
        }
        setLoading(false);
      } catch (error) {
        setError(error.message); // Fehlernachricht setzen
        console.error("Fehler beim Abrufen der Kampf-Daten:", error);
        setLoading(false);
      }
    };

    fetchBattleData();
  }, [characterId, accountId]);

  // Funktion für den Kampfablauf
  const handleFight = () => {
    if (!player || !enemy || fightInProgress) return;

    setFightInProgress(true);

    const playerDamage = Math.max(0, player.attack - enemy.defense);
    const enemyDamage = Math.max(0, enemy.attack - player.defense);

    const newEnemyHp = Math.max(0, enemy.hp - playerDamage);
    const newPlayerHp = Math.max(0, player.hp - enemyDamage);

    setTimeout(() => {
      setBattleLog((prevLog) => [
        ...prevLog,
        `${player.name} greift an und verursacht ${playerDamage} Schaden!`,
        `${enemy.name} greift an und verursacht ${enemyDamage} Schaden!`,
      ]);

      setEnemy((prevEnemy) => ({
        ...prevEnemy,
        hp: newEnemyHp,
      }));

      setPlayer((prevPlayer) => ({
        ...prevPlayer,
        hp: newPlayerHp,
      }));

      setFightInProgress(false);

      if (newEnemyHp <= 0) {
        setBattleLog((prevLog) => [
          ...prevLog,
          `${player.name} hat ${enemy.name} besiegt!`,
        ]);
      } else if (newPlayerHp <= 0) {
        setBattleLog((prevLog) => [
          ...prevLog,
          `${enemy.name} hat ${player.name} besiegt!`,
        ]);
      }
    }, 1000); // Animation dauert 1 Sekunde
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.arena}>
      {error && <div style={{ color: "red" }}>{error}</div>}{" "}
      {/* Fehler anzeigen */}
      {/* Linke Seite: Spieler */}
      <div style={styles.side}>
        <h2>Spieler</h2>
        <p>{player.name}</p>
        <div style={styles.hpBarContainer}>
          <div
            style={{
              ...styles.hpBar,
              width: `${(player.hp / player.maxHp) * 100}%`,
            }}
          ></div>
        </div>
        <p>
          HP: {player.hp}/{player.maxHp}
        </p>
      </div>
      {/* Kampflog in der Mitte */}
      <div style={styles.log}>
        <h3>Kampflog</h3>
        <ul style={styles.logList}>
          {battleLog.map((entry, index) => (
            <li key={index}>{entry}</li>
          ))}
        </ul>
        {player.hp > 0 && enemy.hp > 0 && (
          <button onClick={handleFight} style={styles.fightButton}>
            Kämpfen!
          </button>
        )}
      </div>
      {/* Rechte Seite: Gegner */}
      <div style={styles.side}>
        <h2>Gegner</h2>
        <p>{enemy.name}</p>
        <div style={styles.hpBarContainer}>
          <div
            style={{
              ...styles.hpBar,
              width: `${(enemy.hp / enemy.maxHp) * 100}%`,
              backgroundColor: "red",
            }}
          ></div>
        </div>
        <p>
          HP: {enemy.hp}/{enemy.maxHp}
        </p>
      </div>
    </div>
  );
};

// Stile für die Komponente
const styles = {
  arena: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f9f9f9",
  },
  side: {
    width: "30%",
    textAlign: "center",
  },
  log: {
    width: "40%",
    textAlign: "center",
  },
  logList: {
    listStyleType: "none",
    padding: 0,
    maxHeight: "200px",
    overflowY: "auto",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fff",
  },
  fightButton: {
    marginTop: "10px",
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  hpBarContainer: {
    width: "100%",
    height: "15px",
    backgroundColor: "#ddd",
    borderRadius: "5px",
    marginBottom: "10px",
  },
  hpBar: {
    height: "100%",
    borderRadius: "5px",
    backgroundColor: "green",
  },
};

export default BattleArena;
