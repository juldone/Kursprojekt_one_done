import React, { useState, useEffect } from "react";

const Fight = () => {
  const [accountId, setAccountId] = useState(null); // Account ID
  const [characterId, setCharacterId] = useState(""); // Charakter-ID
  const [characters, setCharacters] = useState([]); // Liste der Charaktere
  const [battleResult, setBattleResult] = useState(null); // Kampfergebnis
  const [loading, setLoading] = useState(false); // Ladezustand
  const [error, setError] = useState(null); // Fehlerzustand
  const [loadingCharacters, setLoadingCharacters] = useState(true); // Ladezustand für Charaktere
  const [token, setToken] = useState(""); // Token

  useEffect(() => {
    // Hole die accountId und den token aus dem localStorage
    const storedAccountId = localStorage.getItem("accountId");
    const storedToken = localStorage.getItem("token");
    if (storedAccountId && storedToken) {
      setAccountId(storedAccountId);
      setToken(storedToken);
      fetchCharacters(storedAccountId, storedToken); // Hole die Charaktere für den Account
    }
  }, []);

  // Hole die Charaktere für den Account
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

      // Sicherstellen, dass die zurückgegebenen Daten ein Array sind
      if (Array.isArray(data)) {
        setCharacters(data); // Setze die erhaltenen Charaktere
      } else {
        throw new Error(
          "Die erhaltenen Daten sind keine gültige Liste von Charakteren."
        );
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
      // Sende POST-Anfrage an den Backend-Endpunkt
      const response = await fetch("http://localhost:3000/battle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // JWT Token hinzufügen
        },
        body: JSON.stringify({
          accountId, // accountId aus dem State
          characterId, // characterId aus dem State
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ein Fehler ist aufgetreten.");
      }

      const data = await response.json();

      // Ergebnis speichern
      setBattleResult(data);
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

      {/* Dropdown-Menü für Charaktere */}
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
            {characters &&
            Array.isArray(characters) &&
            characters.length > 0 ? (
              characters.map((character) => (
                <option key={character._id} value={character._id}>
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
          style={{
            marginLeft: "10px",
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Kämpfen!
        </button>
      </div>

      {loading && <p>Lädt... Der Kampf beginnt!</p>}

      {error && <p style={{ color: "red" }}>Fehler: {error}</p>}

      {battleResult && (
        <div style={{ marginTop: "20px", lineHeight: "1.6" }}>
          <h2>Kampfergebnis</h2>
          <p>{battleResult.message}</p>

          {battleResult.drops && battleResult.drops.length > 0 && (
            <>
              <h3>Erhaltene Drops:</h3>
              <ul>
                {battleResult.drops.map((drop, index) => (
                  <li key={index}>
                    {drop.quantity}x {drop.material}
                  </li>
                ))}
              </ul>
            </>
          )}

          {battleResult.userMaterials && (
            <>
              <h3>Aktualisierte Materialien:</h3>
              <ul>
                {Object.entries(battleResult.userMaterials).map(
                  ([material, quantity]) => (
                    <li key={material}>
                      {material}: {quantity}
                    </li>
                  )
                )}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Fight;
