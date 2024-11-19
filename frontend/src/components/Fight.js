import React, { useState, useEffect } from "react";

const Fight = () => {
  const [characters, setCharacters] = useState([]); // Liste der verfügbaren Charaktere
  const [selectedCharacter, setSelectedCharacter] = useState(null); // Ausgewählter Charakter
  const [battleResult, setBattleResult] = useState(null); // Kampfergebnis
  const [loading, setLoading] = useState(false); // Ladezustand
  const [error, setError] = useState(null); // Fehlerzustand

  // Beispiel-Token (ersetze dies durch tatsächliche Logik, um den Token zu speichern/abrufen)
  const token = localStorage.getItem("authToken");

  // Charaktere laden
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await fetch("http://localhost:3000", {
          headers: {
            Authorization: `Bearer ${token}`, // Token im Authorization-Header
          },
        });

        if (!response.ok) {
          throw new Error("Fehler beim Abrufen der Charaktere");
        }

        const data = await response.json();
        setCharacters(data.characters); // `data.characters` sollte ein Array von Charakteren sein
      } catch (err) {
        console.error("Fehler beim Abrufen der Charaktere:", err.message);
        setError("Charaktere konnten nicht geladen werden.");
      }
    };

    fetchCharacters();
  }, [token]);

  // Kampf starten
  const handleFight = async () => {
    if (!selectedCharacter) return;

    setLoading(true);
    setError(null);
    setBattleResult(null);

    try {
      const response = await fetch("http://localhost:3000/battle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Token im Authorization-Header
        },
        body: JSON.stringify({ characterId: selectedCharacter.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ein Fehler ist aufgetreten.");
      }

      const data = await response.json();
      setBattleResult(data); // Ergebnis speichern
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
          Wähle deinen Charakter:
          <select
            value={selectedCharacter?.id || ""}
            onChange={(e) => {
              const selectedId = e.target.value;
              const character = characters.find(
                (char) => char.id === selectedId
              );
              setSelectedCharacter(character || null);
            }}
            style={{
              marginLeft: "10px",
              padding: "5px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">-- Charakter auswählen --</option>
            {characters.map((character) => (
              <option key={character.id} value={character.id}>
                {character.name} (Level: {character.level})
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={handleFight}
          disabled={!selectedCharacter}
          style={{
            marginLeft: "10px",
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: selectedCharacter ? "#007bff" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: selectedCharacter ? "pointer" : "not-allowed",
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
