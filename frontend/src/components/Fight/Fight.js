import React, { useState, useEffect } from "react";
import BattleArena from "../Battlearena/BattleArena.js";
import { useNavigate } from "react-router-dom";
import "./Fight.css";

const Fight = () => {
  const [accountId, setAccountId] = useState(null);
  const [characterId, setCharacterId] = useState("");
  const [characters, setCharacters] = useState([]);
  const [battleResult, setBattleResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingCharacters, setLoadingCharacters] = useState(true);
  const [token, setToken] = useState("");
  const [showArena, setShowArena] = useState(false); // Steuert die Anzeige der Battlearena
  const navigate = useNavigate();

  useEffect(() => {
    // Füge die Klasse zu body hinzu
    document.body.classList.add("fight-background");

    // Bereinigung nach Verlassen der Seite
    return () => {
      document.body.classList.remove("fight-background");
    };
  }, []);

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
      setBattleResult(data);
      setShowArena(true); // Zeigt die Battlearena an
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    // Funktion zum Zurückkehren zur Charakterauswahl
    setShowArena(false);
    setBattleResult(null);
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f4f4f9",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>
        Kampfvorbereitung
      </h1>
      {!showArena ? (
        <>
          <p
            style={{
              fontSize: "18px",
              color: "#555",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            Wähle deinen Charakter aus und gehe auf "Kämpfen!" um in den
            Kampfbildschirm zu gelangen.
          </p>
          {loadingCharacters ? (
            <p style={{ fontSize: "16px", color: "#888", textAlign: "center" }}>
              Charaktere werden geladen...
            </p>
          ) : (
            <div style={{ marginBottom: "20px", textAlign: "center" }}>
              <select
                value={characterId}
                onChange={(e) => setCharacterId(e.target.value)}
                style={{
                  padding: "12px 25px",
                  fontSize: "16px",
                  borderRadius: "10px",
                  border: "1px solid #ddd",
                  backgroundColor: "#fff",
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  width: "200px",
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
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <button
              onClick={handleFight}
              disabled={!characterId}
              style={{
                padding: "12px 25px",
                fontSize: "16px",
                backgroundColor: characterId ? "#007bff" : "#ccc",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: characterId ? "pointer" : "not-allowed",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = characterId
                  ? "#0056b3"
                  : "#ccc")
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = characterId
                  ? "#007bff"
                  : "#ccc")
              }
            >
              Kämpfen!
            </button>
            <button
              onClick={() => navigate("/account")}
              className="back-button3"
              style={{
                padding: "12px 25px",
                fontSize: "16px",
                backgroundColor: characterId ? "#007bff" : "#ccc",
                color: "white",
                border: "none",
                borderRadius: "50px",
                cursor: characterId ? "pointer" : "not-allowed",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#ddd")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
            >
              Zurück zur Account-Seite
            </button>
          </div>
          {loading && (
            <p style={{ fontSize: "16px", color: "#888", textAlign: "center" }}>
              Lädt... Der Kampf beginnt!
            </p>
          )}
          {error && (
            <p style={{ color: "red", fontSize: "16px", textAlign: "center" }}>
              Fehler: {error}
            </p>
          )}
        </>
      ) : (
        <BattleArena
          battleResult={battleResult}
          characters={characters}
          characterId={characterId}
          accountId={accountId}
          token={token}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default Fight;
