import React, { useState, useEffect, useRef } from "react";

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

  // Refs für die aktuellen HP-Werte
  const playerHpRef = useRef(playerHp);
  const enemyHpRef = useRef(enemyHp);

  // Wird bei HP-Änderung aufgerufen, um Ref zu aktualisieren
  useEffect(() => {
    playerHpRef.current = playerHp;
  }, [playerHp]);

  useEffect(() => {
    enemyHpRef.current = enemyHp;
  }, [enemyHp]);

  const handleFightInArena = async () => {
    setLoading(true);
    setError(null);
    setFightResult(null);

    // Healthbars zurücksetzen, bevor der neue Kampf startet
    setPlayerHp(100); // Maximaler Wert für Spieler-HP (anpassen, falls anders)
    setEnemyHp(100); // Maximaler Wert für Gegner-HP

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
      simulateHpChanges(data.character.stats.hp, data.enemy.stats.health);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const simulateHpChanges = (newPlayerHp, newEnemyHp) => {
    let playerHpDifference = newPlayerHp - playerHpRef.current;
    let enemyHpDifference = newEnemyHp - enemyHpRef.current;

    const animateHpChange = () => {
      if (Math.abs(playerHpDifference) < 1 && Math.abs(enemyHpDifference) < 1) {
        return; // Animation beenden, wenn beide HP-Werte erreicht sind
      }

      // Player HP Animation
      if (Math.abs(playerHpDifference) >= 1) {
        setPlayerHp((prevHp) => {
          const newHp = prevHp + Math.sign(playerHpDifference) * 1; // 1 HP pro Frame ändern
          playerHpDifference = newPlayerHp - newHp;
          return newHp;
        });
      }

      // Enemy HP Animation
      if (Math.abs(enemyHpDifference) >= 1) {
        setEnemyHp((prevHp) => {
          const newHp = prevHp + Math.sign(enemyHpDifference) * 1; // 1 HP pro Frame ändern
          enemyHpDifference = newEnemyHp - newHp;
          return newHp;
        });
      }

      requestAnimationFrame(animateHpChange); // Nächsten Animationsframe anfordern
    };

    animateHpChange(); // Animation starten
  };

  const toggleLogVisibility = () => {
    setIsLogOpen((prev) => !prev);
  };

  const HealthBar = ({ currentHp, maxHp, color }) => (
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
          width: `${(currentHp / maxHp) * 100}%`,
          height: "100%",
          backgroundColor: color,
          transition: "width 0.5s ease-out",
        }}
      ></div>
    </div>
  );

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
          <img
            src={`../../logo512.png`} // Bild aus dem public Ordner
            alt={playerCharacter?.name}
            style={{ width: "100px", height: "100px", borderRadius: "50%" }}
          />
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
            <HealthBar currentHp={playerHp} maxHp={100} color="green" />
          </div>
          <p>HP: {playerHp}</p>
        </div>

        {/* Gegner */}
        <div style={{ textAlign: "right" }}>
          <h2>Gegner</h2>
          <img
            src={`../../logo512.png`} // Bild aus dem public Ordner
            alt="Bild"
            style={{ width: "100px", height: "100px", borderRadius: "50%" }}
          />
          <p>Level: ????</p>
          <div
            style={{
              width: "200px",
              height: "20px",
              backgroundColor: "#ccc",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <HealthBar currentHp={enemyHp} maxHp={100} color="red" />
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
          <p>{fightResult.battleSummary.message}</p>

          {/* Kampf-Log */}
          {fightResult?.battleLog?.length > 0 && (
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
                  {fightResult.battleLog.map((log, index) => (
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
          {fightResult?.rewards?.drops?.length > 0 && (
            <div>
              <h3>Belohnungen</h3>
              {fightResult.rewards.drops.map((drop, index) => (
                <div key={index}>
                  <p>
                    {drop.material}: {drop.quantity} Stück
                  </p>
                </div>
              ))}
            </div>
          )}
          <p>{fightResult.reward}</p>
        </div>
      )}

      {/* Fehler */}
      {error && <p style={{ color: "red" }}>Fehler: {error}</p>}
    </div>
  );
};

export default Battlearena;
