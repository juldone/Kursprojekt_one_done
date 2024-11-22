import React, { useState, useEffect } from "react";
import BattleArena from "./BattleArena.js";
import { calculateDamage, processRound } from "./battlelogic"; // Importiere die Logik

const Fight = () => {
  const [accountId, setAccountId] = useState(null);
  const [characterId, setCharacterId] = useState("");
  const [characters, setCharacters] = useState([]);
  const [battleResult, setBattleResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingCharacters, setLoadingCharacters] = useState(true);
  const [token, setToken] = useState("");
  const [showArena, setShowArena] = useState(false);

  useEffect(() => {
    const storedAccountId = localStorage.getItem("accountId");
    const storedToken = localStorage.getItem("token");

    if (storedAccountId && storedToken) {
      setAccountId(storedAccountId);
      setToken(storedToken);
      fetchCharacters(storedAccountId, storedToken);
    }
  }, []);

  const fetchCharacters = async (accountId, token) => {
    setLoadingCharacters(true);
    try {
      const response = await fetch(`http://localhost:3000/user/${accountId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Fehler beim Abrufen der Charaktere.");
      }

      const data = await response.json();
      if (data && data.characters) {
        setCharacters(data.characters);
      } else {
        throw new Error("Keine Charaktere gefunden.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingCharacters(false);
    }
  };

  const handleFight = async () => {
    if (!characterId) {
      setError("Bitte wähle einen Charakter aus.");
      return;
    }

    setLoading(true);
    setError(null);
    setBattleResult(null);

    try {
      const response = await fetch("http://localhost:3000/battle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          accountId,
          characterId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ein Fehler ist aufgetreten.");
      }

      const data = await response.json();
      const { character, enemy } = data;

      let characterHp = character.stats.hp;
      let enemyHp = enemy.stats.health;
      const battleLog = [];

      // Kampfschleife mit Damage-Berechnung und Prozess der Runde
      while (characterHp > 0 && enemyHp > 0) {
        // Berechne den Schaden für beide Parteien
        const characterDamage = calculateDamage(character, enemy);
        const enemyDamage = calculateDamage(enemy, character);

        // Die Rundenlogik auslagern (z.B. HP aktualisieren)
        const roundResult = processRound(
          character,
          enemy,
          characterDamage,
          enemyDamage
        );

        // Aktualisiere die HP des Charakters und des Feindes
        characterHp = roundResult.characterHp;
        enemyHp = roundResult.enemyHp;

        battleLog.push({
          round: battleLog.length + 1,
          characterAttack: characterDamage,
          enemyAttack: enemyDamage,
          characterHp,
          enemyHp: Math.max(0, enemyHp),
        });

        // Überprüfe den Ausgang des Kampfes
        if (enemyHp <= 0) {
          setBattleResult({
            winner: "character",
            battleLog,
            characterHp,
            enemyHp: 0,
          });
          setShowArena(true);
          return;
        }

        if (characterHp <= 0) {
          setBattleResult({
            winner: "enemy",
            battleLog,
            characterHp: 0,
            enemyHp,
          });
          setShowArena(true);
          return;
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setShowArena(false);
    setBattleResult(null);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Kampfmodus</h1>
      {!showArena ? (
        <>
          <p>
            Wähle einen Charakter aus und drücke auf Kämpfen, um den Kampf zu
            starten!
          </p>
          {loadingCharacters ? (
            <p>Charaktere werden geladen...</p>
          ) : (
            <div style={{ marginBottom: "20px" }}>
              <select
                value={characterId}
                onChange={(e) => setCharacterId(e.target.value)}
                style={{
                  padding: "10px 20px",
                  fontSize: "16px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                <option value="">Wähle einen Charakter</option>
                {characters && characters.length > 0 ? (
                  characters.map((character) => (
                    <option
                      key={character.characterId}
                      value={character.characterId}
                    >
                      {character.name} (Level {character.level})
                    </option>
                  ))
                ) : (
                  <option disabled>Keine Charaktere verfügbar</option>
                )}
              </select>
            </div>
          )}
          <div style={{ marginBottom: "20px" }}>
            <button
              onClick={handleFight}
              disabled={!characterId}
              style={{
                marginLeft: "10px",
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: characterId ? "#007bff" : "#ccc",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: characterId ? "pointer" : "not-allowed",
              }}
            >
              Kämpfen
            </button>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </>
      ) : (
        <BattleArena battleResult={battleResult} onBack={handleBack} />
      )}
    </div>
  );
};

export default Fight;
