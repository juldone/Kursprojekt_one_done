import React, { useState, useEffect, useRef } from "react";

const Battlearena = ({
  battleResult,
  characters,
  characterId,
  accountId,
  onBack,
  token,
}) => {
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

  // Effekt zum Setzen der Balken auf 0, wenn der Kampf abgeschlossen ist
  useEffect(() => {
    if (playerHp === 0) {
      const playerBar = document.querySelector(".player-health-bar");
      if (playerBar) {
        playerBar.style.width = "0%"; // Setzt die Breite des Spieler-Balkens auf 0%
      }
    }

    if (enemyHp === 0) {
      const enemyBar = document.querySelector(".enemy-health-bar");
      if (enemyBar) {
        enemyBar.style.width = "0%"; // Setzt die Breite des Gegner-Balkens auf 0%
      }
    }
  }, [playerHp, enemyHp]);

  const handleFightInArena = async () => {
    if (isFighting) return; // Verhindert den Start eines neuen Kampfes, wenn bereits einer läuft
    setIsFighting(true); // Setzt den Kampfstatus auf "kämpfend"

    setLoading(true);
    setError(null); // Fehler wird zurückgesetzt
    setFightResult(null);
    setPlayerHp(100);
    setEnemyHp(100);

    // Verzögerung einbauen, bevor der Kampf fortgesetzt wird
    await new Promise((resolve) => {
      const playerBar = document.querySelector(".player-health-bar");
      const enemyBar = document.querySelector(".enemy-health-bar");

      if (playerBar && enemyBar) {
        const handleTransitionEnd = () => {
          // Entfernt Event Listener, wenn die Transition beendet ist
          playerBar.removeEventListener("transitionend", handleTransitionEnd);
          enemyBar.removeEventListener("transitionend", handleTransitionEnd);
          resolve();
        };

        // Fügt Event Listener für Übergangsende hinzu
        playerBar.addEventListener("transitionend", handleTransitionEnd);
        enemyBar.addEventListener("transitionend", handleTransitionEnd);
      } else {
        resolve(); // Wenn die Elemente nicht gefunden werden, wird sofort fortgefahren
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

      // Fehlerbehandlung
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ein Fehler ist aufgetreten.");
      }
      const data = await response.json();
      console.log(data); // Antwort loggen, um sicherzustellen, dass die Daten richtig ankommen
      setFightResult(data);

      simulateHpChanges(data.character.stats.hp, data.enemy.stats.health);
    } catch (err) {
      setError(err.message); // Fehler wird im State gespeichert
    } finally {
      setLoading(false);
      // Verzögerung einbauen, bevor der Kampfstatus zurückgesetzt wird
      setTimeout(() => {
        setIsFighting(false); // Kampf beendet, Status zurücksetzen
      }, 1000); // 1 Sekunde Verzögerung
    }
  };

  // Simuliert HP-Änderungen während des Kampfes
  const simulateHpChanges = (newPlayerHp, newEnemyHp) => {
    const interval = setInterval(() => {
      // Aktualisieren der HP basierend auf der Differenz
      setPlayerHp((prevHp) => {
        const updatedHp = Math.max(prevHp - 5, 0); // Schnellerer Rückgang (größere Schritte)
        if (updatedHp === 0) clearInterval(interval); // Stoppt die Simulation, wenn der Wert 0 erreicht
        return updatedHp;
      });

      // HP des Gegners aktualisieren
      setEnemyHp((prevHp) => {
        const updatedHp = Math.max(prevHp - 5, 0); // Schnellerer Rückgang (größere Schritte)
        if (updatedHp === 0) clearInterval(interval); // Stoppt die Simulation, wenn der Wert 0 erreicht.
        return updatedHp;
      });

      // Wenn beide HP-Werte erreicht sind, stoppen wir die Simulation
      if (playerHp === newPlayerHp && enemyHp === newEnemyHp) {
        clearInterval(interval);
        updateWinnerHealthBar(); // Funktion zum Aktualisieren des Lebensbalkens des Siegers
      }
    }, 50); // Das Intervall auf 50ms gesetzt für schnellere Änderungen
  };

  // Funktion zum Aktualisieren des Lebensbalkens des Siegers
  const updateWinnerHealthBar = () => {
    if (fightResult && fightResult.winner === "player") {
      setPlayerHp(100); // Setzt die HP des Spielers auf 100, wenn er gewonnen hat
    } else if (fightResult && fightResult.winner === "enemy") {
      setEnemyHp(100); // Setzt die HP des Gegners auf 100, wenn er gewonnen hat
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
  healthBar: (color, hp) => ({
    backgroundColor: color,
    width: `${hp}%`,
    height: "100%",
  }),
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
