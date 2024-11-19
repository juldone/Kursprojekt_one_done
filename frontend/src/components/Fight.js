import React, { useState } from "react";

const Fight = () => {
  const [characterId, setCharacterId] = useState(""); // ID des Charakters
  const [battleResult, setBattleResult] = useState(null); // Kampfergebnis
  const [loading, setLoading] = useState(false); // Ladezustand
  const [error, setError] = useState(null); // Fehlerzustand

  const handleFight = async () => {
    setLoading(true);
    setError(null);
    setBattleResult(null);

    try {
      // Sende POST-Anfrage an den Backend-Endpunkt
      const response = await fetch("http://localhost:5000/api/battle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ characterId }),
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
        Wähle deinen Charakter aus und starte den Kampf gegen einen zufälligen
        Gegner!
      </p>

      <div style={{ marginBottom: "20px" }}>
        <label>
          Charakter-ID:
          <input
            type="text"
            value={characterId}
            onChange={(e) => setCharacterId(e.target.value)}
            style={{
              marginLeft: "10px",
              padding: "5px",
              fontSize: "16px",
            }}
          />
        </label>
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
