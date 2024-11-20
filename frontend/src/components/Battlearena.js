import React, { useState } from "react";

const Battlearena = ({
  battleResult,
  characters,
  characterId,
  accountId, // Füge accountId als Prop hinzu
  onBack,
  token,
}) => {
  const [fightResult, setFightResult] = useState(null); // Zustand für das Kampfergebnis
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const playerCharacter = characters.find((char) => char._id === characterId);
  const enemyCharacter = battleResult?.enemy;

  const handleFightInArena = async () => {
    setLoading(true);
    setError(null);
    setFightResult(null);

    try {
      const response = await fetch("http://localhost:3000/battle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // JWT Token verwenden
        },
        body: JSON.stringify({
          accountId, // Verwende die übergebene accountId
          characterId: playerCharacter._id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ein Fehler ist aufgetreten.");
      }

      const data = await response.json();
      setFightResult(data); // Ergebnis des Kampfes anzeigen
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <h1>Battle Arena</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          padding: "20px",
        }}
      >
        {/* Spielercharakter */}
        <div style={{ textAlign: "left" }}>
          <h2>{playerCharacter?.name}</h2>
          <p>Level: {playerCharacter?.level}</p>
          <div
            style={{
              width: "200px",
              height: "20px",
              backgroundColor: "#ccc",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${playerCharacter?.hp || 100}%`,
                height: "100%",
                backgroundColor: "green",
              }}
            ></div>
          </div>
          <p>HP: {playerCharacter?.hp || 100}</p>
        </div>

        {/* Gegner */}
        <div style={{ textAlign: "right" }}>
          <h2>{enemyCharacter?.name}</h2>
          <p>Level: {enemyCharacter?.level}</p>
          <div
            style={{
              width: "200px",
              height: "20px",
              backgroundColor: "#ccc",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${enemyCharacter?.hp || 100}%`,
                height: "100%",
                backgroundColor: "red",
              }}
            ></div>
          </div>
          <p>HP: {enemyCharacter?.hp || 100}</p>
        </div>
      </div>

      {/* Fight Button */}
      <button
        onClick={handleFightInArena}
        disabled={loading}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: loading ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Kämpft..." : "Kämpfen"}
      </button>

      {/* Zurück Button */}
      <button
        onClick={onBack}
        style={{
          marginLeft: "10px",
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#f44336",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Zurück zur Auswahl
      </button>

      {/* Kampfergebnis */}
      {fightResult && (
        <div style={{ marginTop: "20px", lineHeight: "1.6" }}>
          <h2>Kampfergebnis</h2>
          <p>{fightResult.message}</p>

          {fightResult.drops && fightResult.drops.length > 0 && (
            <>
              <h3>Erhaltene Drops:</h3>
              <ul>
                {fightResult.drops.map((drop, index) => (
                  <li key={index}>
                    {drop.quantity}x {drop.material}
                  </li>
                ))}
              </ul>
            </>
          )}

          {fightResult.userMaterials && (
            <>
              <h3>Aktualisierte Materialien:</h3>
              <ul>
                {Object.entries(fightResult.userMaterials).map(
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

      {/* Fehleranzeige */}
      {error && <p style={{ color: "red" }}>Fehler: {error}</p>}
    </div>
  );
};

export default Battlearena;
