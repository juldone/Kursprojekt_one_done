import React, { useState, useEffect, useRef } from "react";

const Battlearena = ({ characters, characterId, accountId, onBack, token }) => {
  // States für verschiedene Informationen des Kampfes
  const [fightResult, setFightResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Fehlerzustand bleibt erhalten
  const [playerHp, setPlayerHp] = useState(100);
  const [enemyHp, setEnemyHp] = useState(100);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [isFighting, setIsFighting] = useState(false); // Neuer State für den Kampfstatus

  const playerCharacter = characters.find(
    (char) => char.characterId === characterId
  );

  const playerHpRef = useRef(playerHp);
  const enemyHpRef = useRef(enemyHp);

  // Speichert aktuelle HP-Werte für den Spieler und Gegner
  useEffect(() => {
    playerHpRef.current = playerHp;
  }, [playerHp]);

  useEffect(() => {
    enemyHpRef.current = enemyHp;
  }, [enemyHp]);

  const handleFightInArena = async () => {
    if (isFighting) return; // Verhindert den Start eines neuen Kampfes, wenn bereits einer läuft
    setIsFighting(true); // Setzt den Kampfstatus auf "kämpfend"

    setLoading(true);
    setError(null); // Fehler wird zurückgesetzt
    setFightResult(null);
    setPlayerHp(100);
    setEnemyHp(100);

    await new Promise((resolve) => {
      const playerBar = document.querySelector(".player-health-bar");
      const enemyBar = document.querySelector(".enemy-health-bar");

      if (playerBar && enemyBar) {
        const handleTransitionEnd = () => {
          playerBar.removeEventListener("transitionend", handleTransitionEnd);
          enemyBar.removeEventListener("transitionend", handleTransitionEnd);
          resolve();
        };

        playerBar.addEventListener("transitionend", handleTransitionEnd);
        enemyBar.addEventListener("transitionend", handleTransitionEnd);
      } else {
        resolve();
      }
    });

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
      console.log(data);
      setFightResult(data);

      // Aktualisiere die HP-Balken basierend auf den Backend-Daten
      updateHpBars(data.character.stats.hp, data.enemy.stats.health, data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setIsFighting(false);
      }, 1000);
    }
  };

  // Funktion zum Setzen der HP basierend auf echten Daten
  const updateHpBars = (newPlayerHp, newEnemyHp, fightResult) => {
    console.log("Update HP Called:");
    console.log("Player HP:", newPlayerHp, "Enemy HP:", newEnemyHp);

    // Setze HP direkt auf 0, wenn der Kampf vorbei ist
    if (fightResult) {
      if (fightResult.winner === "player") {
        newEnemyHp = 0;
      } else if (fightResult.winner === "enemy") {
        newPlayerHp = 0;
      }
    }

    // Verzögere die Änderungen der HP für eine sichtbare Übergangsanimation
    setTimeout(() => {
      setPlayerHp(newPlayerHp);
      setEnemyHp(newEnemyHp);
    }, 100); // 100ms Verzögerung, um den Übergang auszulösen

    // Verzögere den Übergang, um sicherzustellen, dass der Balken auf 0 schrumpft
    if (
      fightResult &&
      (fightResult.winner === "player" || fightResult.winner === "enemy")
    ) {
      setTimeout(() => {
        if (fightResult.winner === "player") {
          setEnemyHp(0); // Setze die HP des Gegners sofort auf 0
        } else if (fightResult.winner === "enemy") {
          setPlayerHp(0); // Setze die HP des Spielers sofort auf 0
        }
      }, 500); // Warte 500ms, um den Übergang abzuschließen
    }
  };

  const toggleLogVisibility = () => {
    setIsLogOpen((prev) => !prev);
  };

  return (
    <div style={styles.container}>
      <h1>Battle Arena</h1>
      <div style={styles.arena}>
        <div style={styles.characterContainer}>
          <h2>{playerCharacter?.name}</h2>
          <img
            src={`../../logo512.png`}
            alt={playerCharacter?.name}
            style={{ width: "100px", height: "100px", borderRadius: "50%" }}
          />
          <p>Level: {playerCharacter?.level}</p>
          <div style={styles.healthBarContainer}>
            <div style={styles.healthBar("green", playerHp)}></div>
          </div>
          <p>HP: {playerHp}</p>
        </div>
        <div style={styles.enemyContainer}>
          <h2>Gegner</h2>
          <img
            src={`../../logo512.png`}
            alt="Bild"
            style={{ width: "100px", height: "100px", borderRadius: "50%" }}
          />
          <p>Level: ????</p>
          <div style={styles.healthBarContainer}>
            {console.log("Enemy HP in Render:", enemyHp)}
            <div style={styles.healthBar("red", enemyHp)}></div>
          </div>
          <p>HP: {enemyHp}</p>
        </div>
      </div>

      <button
        onClick={handleFightInArena}
        disabled={loading}
        style={styles.button(loading)}
      >
        {loading ? "Kämpft..." : "Kämpfen"}
      </button>

      <button onClick={onBack} style={styles.backButton}>
        Zurück zur Auswahl
      </button>

      {error && (
        <div style={styles.errorMessage}>
          <p>{error}</p>
        </div>
      )}

      {fightResult && (
        <div style={{ marginTop: "20px", lineHeight: "1.6" }}>
          <h2>Kampfergebnis</h2>
          <p>{fightResult.battleSummary.message}</p>

          {fightResult?.battleLog?.length > 0 && (
            <div>
              <h3 onClick={toggleLogVisibility} style={{ cursor: "pointer" }}>
                {isLogOpen ? "Kampflog schließen" : "Kampflog anzeigen"}
              </h3>

              {isLogOpen && (
                <div style={styles.logContainer}>
                  {fightResult.battleLog.map((log, index) => (
                    <div key={index}>
                      <p>Runde {log.round}</p>
                      <p>Angriff des Charakters: {log.characterAttack}</p>
                      <p>Angriff des Gegners: {log.enemyAttack}</p>
                      <p>Schaden an Charakter: {log.damageToCharacter}</p>
                      <p>Schaden an Gegner: {log.damageToEnemy}</p>
                      <p>HP des Characters: {log.characterHp}</p>
                      <p>HP des Gegners: {log.enemyHp}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Belohnungen (Loot Drops) anzeigen */}
          {fightResult.loot && (
            <div>
              <h3>Beute</h3>
              <ul>
                {fightResult.loot.map((item, index) => (
                  <li key={index}>{item.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  },
  arena: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: "20px",
  },
  characterContainer: {
    display: "inline-block",
    textAlign: "center",
  },
  enemyContainer: {
    display: "inline-block",
    textAlign: "center",
  },
  healthBarContainer: {
    backgroundColor: "#ccc",
    width: "100%",
    height: "20px",
    margin: "5px 0",
  },
  healthBar: (color, hp) => {
    console.log("Health Bar Width:", `${hp}`);
    return {
      backgroundColor: color,
      width: `${hp}%`, // Setzt die Breite basierend auf den HP
      height: "100%",
      transition: "width 0.5s eas-in-out", // Animiert den Übergang
    };
  },
  button: (loading) => ({
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: loading ? "#ccc" : "#28a745",
    color: "#fff",
    border: "none",
    cursor: loading ? "not-allowed" : "pointer",
    borderRadius: "5px",
    marginBottom: "10px",
  }),
  backButton: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    marginTop: "10px",
  },
  logContainer: {
    marginTop: "10px",
    textAlign: "left",
    border: "1px solid #ccc",
    padding: "10px",
    backgroundColor: "#f9f9f9",
  },
  errorMessage: {
    color: "red",
    fontWeight: "bold",
    marginTop: "10px",
  },
};

export default Battlearena;
