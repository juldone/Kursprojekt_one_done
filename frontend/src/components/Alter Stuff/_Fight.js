import React, { useState, useEffect } from "react";
import BattleArena from "./BattleArena.js"; // Die BattleArena-Komponente importieren

const Fight = () => {
  const [accountId, setAccountId] = useState(null);
  const [characterId, setCharacterId] = useState("");
  const [characters, setCharacters] = useState([]);
  const [battleResult, setBattleResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingCharacters, setLoadingCharacters] = useState(true);
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedAccountId = localStorage.getItem("accountId");
    const storedToken = localStorage.getItem("token");
    const storedCharacterId = localStorage.getItem("chracterId");
    if (storedAccountId && storedToken) {
      setAccountId(storedAccountId);
      setToken(storedToken);
      setCharacterId(storedCharacterId);

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

    // Sicherstellen, dass characterId als String übergeben wird
    const characterIdString = characterId.toString(); // Umwandlung in String

    try {
      const response = await fetch("http://localhost:3000/battle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          accountId,
          characterId: characterIdString, // characterId als String übergeben
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ein Fehler ist aufgetreten.");
      }

      const data = await response.json();
      setBattleResult(data); // Setze das Kampfergebnis
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Kampfmodus</h1>
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
          Kämpfen!
        </button>
      </div>

      {loading && <p>Lädt... Der Kampf beginnt!</p>}
      {error && <p style={{ color: "red" }}>Fehler: {error}</p>}

      {battleResult && (
        <BattleArena
          player={battleResult.player} // Hier werden die Spieler- und Gegnerdaten übergeben
          enemy={battleResult.enemy}
          battleLog={battleResult.log} // Das Kampflog wird weitergegeben
          onFight={handleFight} // Der Kampfbefehl wird weitergegeben, um die nächste Runde zu starten
        />
      )}
    </div>
  );
};

export default Fight;
