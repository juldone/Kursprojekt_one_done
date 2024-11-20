import React, { useState } from "react";

const Battlearena = ({
  battleResult,
  characters,
  characterId,
  accountId,
  onBack,
  token,
}) => {
  const [fightResult, setFightResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playerHp, setPlayerHp] = useState(100); // Spieler-HP (zum Testen voreingestellt)
  const [enemyHp, setEnemyHp] = useState(100); // Gegner-HP
  const [isLogOpen, setIsLogOpen] = useState(false); // Zustand für Einklappen des Kampflogs

  const playerCharacter = characters.find(
    (char) => char.characterId === characterId
  );
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          accountId,
          characterId: playerCharacter.characterId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ein Fehler ist aufgetreten.");
      }

      const data = await response.json();
      setFightResult(data);

      // Animierte Lebenspunkt-Änderung
      simulateHpChanges(data.playerHp, data.enemyHp);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const simulateHpChanges = (newPlayerHp, newEnemyHp) => {
    const interval = setInterval(() => {
      setPlayerHp((hp) => Math.max(hp - 1, newPlayerHp));
      setEnemyHp((hp) => Math.max(hp - 1, newEnemyHp));
      if (playerHp === newPlayerHp && enemyHp === newEnemyHp) {
        clearInterval(interval);
      }
    }, 50); // Geschwindigkeit der Animation
  };

  // Toggle für das Einklappen des Kampflogs
  const toggleLogVisibility = () => {
    setIsLogOpen((prev) => !prev);
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
                width: `${playerHp}%`,
                height: "100%",
                backgroundColor: "green",
                transition: "width 0.5s ease-in-out",
              }}
            ></div>
          </div>
          <p>HP: {playerHp}</p>
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
                width: `${enemyHp}%`,
                height: "100%",
                backgroundColor: "red",
                transition: "width 0.5s ease-in-out",
              }}
            ></div>
          </div>
          <p>HP: {enemyHp}</p>
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

          {/* Kampf-Log */}
          {battleResult?.battleLog?.length > 0 && (
            <div>
              <h3 onClick={toggleLogVisibility} style={{ cursor: "pointer" }}>
                {isLogOpen ? "Kampflog schließen" : "Kampflog anzeigen"}
              </h3>

              {isLogOpen && (
                <div
                  style={{
                    maxHeight: "300px",
                    overflowY: "auto",
                    marginTop: "10px",
                    border: "1px solid #ccc",
                    padding: "10px",
                    borderRadius: "5px",
                  }}
                >
                  {battleResult.battleLog.map((log, index) => (
                    <div key={index}>
                      <p>Runde {log.round}</p>
                      <p>Angriff des Charakters: {log.characterAttack}</p>
                      <p>Angriff des Gegners: {log.enemyAttack}</p>
                      <p>HP des Charakters: {log.characterHp}</p>
                      <p>HP des Gegners: {log.enemyHp}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Belohnungen */}
          {battleResult?.rewards?.drops?.length > 0 && (
            <div>
              <h3>Belohnungen</h3>
              {battleResult.rewards.drops.map((drop, index) => (
                <div key={index}>
                  <p>
                    {drop.material}: {drop.quantity} Stück
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Fehleranzeige */}
      {error && <p style={{ color: "red" }}>Fehler: {error}</p>}
    </div>
  );
};

export default Battlearena;
