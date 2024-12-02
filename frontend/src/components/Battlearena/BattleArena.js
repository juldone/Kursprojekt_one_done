import React, { useState, useEffect, useRef } from "react";
import "./Battlearena.css";

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
  const [playerHp, setPlayerHp] = useState(100);
  const [enemyHp, setEnemyHp] = useState(100);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [battleLog, setBattleLog] = useState([]); // Neues Log-Array für schrittweise Anzeige
  const APP_URL = "http://63.176.74.46:3000";
  //const APP_URL = "http://localhost:3000";

  const playerCharacter = characters.find(
    (char) => char.characterId === characterId
  );
  const playerHpRef = useRef(playerHp);
  const enemyHpRef = useRef(enemyHp);

  useEffect(() => {
    playerHpRef.current = playerHp;
  }, [playerHp]);

  useEffect(() => {
    enemyHpRef.current = enemyHp;
  }, [enemyHp]);

  const handleFightInArena = async () => {
    const fightSound = new Audio("/sounds/Battlescream.wav");
    fightSound.volume = 0.2;
    fightSound
      .play()
      .catch((error) =>
        console.error("Fehler beim Abspielen des Sound:", error)
      );

    setLoading(true);
    setError(null);
    setFightResult(null);
    setBattleLog([]);
    setAnimationComplete(false);
    setPlayerHp(100);
    setEnemyHp(100);

    try {
      const response = await fetch(`${APP_URL}/battle`, {
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
      console.log(data.battleLog);
      setFightResult(data);
      simulateHpChanges(
        data.character.stats.hp,
        data.enemy.stats.health,
        data.battleLog
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const simulateHpChanges = (playerFinalHp, enemyFinalHp, battleLog) => {
    if (!Array.isArray(battleLog)) {
      console.error("battleLog is not valid:", battleLog);
      return;
    }

    let currentTurn = 0;

    const interval = setInterval(() => {
      if (currentTurn >= battleLog.length) {
        console.log("Kampf abgeschlossen:", {
          playerFinalHp: playerHpRef.current,
          enemyFinalHp: enemyHpRef.current,
        });
        clearInterval(interval);
        setAnimationComplete(true);
        return;
      }

      const turn = battleLog[currentTurn];
      console.log(`Runde ${turn.round}:`, turn);

      // Spieler verursacht Schaden
      if (turn.characterAttack > 0) {
        // Schaden-Sound abspielen
        const damageSound = new Audio("/sounds/EnemyHit.wav"); // Pfad zur Datei anpassen
        damageSound.volume = 0.2; // Lautstärkeregler (0 bis 1)
        damageSound
          .play()
          .catch((error) =>
            console.error(
              "Fehler beim Abspielen des Schaden-Geräusches:",
              error
            )
          );

        setEnemyHp((prevHp) => {
          const newHp = Math.max(0, prevHp - turn.characterAttack);
          setEnemyDamage(`-${turn.characterAttack} Dmg`); // Schadensanzeige
          setEnemyBlink(true); // Gegner blinkt rot
          setTimeout(() => setEnemyBlink(false), 300); // Nach 300ms zurücksetzen
          setTimeout(() => setEnemyDamage(null), 500); // Schadenszahl verschwindet nach 500 ms
          return newHp;
        });
      }

      // Gegner verursacht Schaden
      if (turn.enemyAttack > 0) {
        // Schaden-Sound abspielen
        const damageSound = new Audio("/sounds/PlayerDamage.wav");
        damageSound.volume = 0.2; // Lautstärkeregler (0 bis 1)
        damageSound
          .play()
          .catch((error) =>
            console.error("Fehler beim Abspielen des Schaden-Geräusches:")
          );

        setPlayerHp((prevHp) => {
          const newHp = Math.max(0, prevHp - turn.enemyAttack);
          setPlayerDamage(`-${turn.enemyAttack} Dmg`); // Schadensanzeige
          setPlayerBlink(true); // Spieler blinkt rot
          setTimeout(() => setPlayerBlink(false), 300); // Nach 300ms zurücksetzen
          setTimeout(() => setPlayerDamage(null), 500); // Schaden verschwindet nach 500ms
          return newHp; // Rückgabewert hinzufügen
        });
      }

      // Battle-Log aktualisieren
      setBattleLog((prevLog) => [
        ...prevLog,
        {
          round: turn.round,
          characterAttack: turn.characterAttack,
          enemyAttack: turn.enemyAttack,
          characterHp: playerHpRef.current,
          enemyHp: enemyHpRef.current,
        },
      ]);

      currentTurn++;
    }, 1000);
  };

  const toggleLogVisibility = () => {
    setIsLogOpen((prev) => !prev);
  };

  const [playerDamage, setPlayerDamage] = useState(null);
  const [enemyDamage, setEnemyDamage] = useState(null);
  const [playerBlink, setPlayerBlink] = useState(false);
  const [enemyBlink, setEnemyBlink] = useState(false);

  return (
    <div className="battlearena">
      <h1>Battle Arena</h1>
      <div className="battle-area">
        <div className="player">
          <h2>{playerCharacter?.name}</h2>
          <img
            src={"/bilder/player.png"}
            alt={playerCharacter?.name}
            className={`character-img ${playerBlink ? "blink" : ""}`}
          />
          {playerDamage && (
            <span className="damage-popup" style={{ top: "-20px" }}>
              {playerDamage}
            </span>
          )}
          <p>Level: {playerCharacter?.level}</p>
          <div className="health-bar">
            <div
              className="health-bar-fill player-hp"
              style={{ width: `${playerHp}%` }}
            ></div>
          </div>
          <p>HP: {playerHp}</p>
        </div>

        {battleLog.length > 0 && (
          <div>
            <h3 onClick={toggleLogVisibility} className="log-toggle">
              {isLogOpen ? "Kampflog schließen" : "Kampflog anzeigen"}
            </h3>
            {isLogOpen && (
              <div className={`battle-log ${isLogOpen ? "visible" : ""}`}>
                {battleLog.map((log, index) => (
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

        <div className="enemy">
          <h2>Gegner</h2>
          <img
            src={"/bilder/gorgon.png"}
            alt="Bild"
            className={`character-img ${enemyBlink ? "blink" : ""}`}
          />
          {enemyDamage && (
            <span className="damage-popup" style={{ top: "-20px" }}>
              {enemyDamage}
            </span>
          )}
          <p>Level: ????</p>
          <div className="health-bar">
            <div
              className="health-bar-fill enemy-hp"
              style={{ width: `${enemyHp}%` }}
            ></div>
          </div>
          <p>HP: {enemyHp}</p>
        </div>
      </div>

      <button
        onClick={handleFightInArena}
        disabled={loading}
        className={`button fight-button ${loading ? "disabled" : ""}`}
      >
        {loading ? "Kämpft..." : "Kämpfen"}
      </button>

      <button onClick={onBack} className="button back-button">
        Zurück zur Auswahl
      </button>

      {fightResult && (
        <div
          className={`fight-result fade-in ${
            animationComplete ? "visible" : ""
          }`}
        >
          <h2 className="title">Kampfergebnis</h2>
          <p className="text">{fightResult.battleSummary.message}</p>
          {fightResult?.rewards?.drops?.length > 0 && (
            <div>
              <h3 className="title">Belohnungen</h3>
              {fightResult.rewards.drops.map((drop, index) => (
                <div key={index} className="text">
                  <p>
                    {drop.material}: {drop.quantity} Stück
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {error && <p className="error-message">Fehler: {error}</p>}
    </div>
  );
};

export default Battlearena;
