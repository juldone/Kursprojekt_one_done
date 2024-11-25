import React, { useState, useEffect, useRef } from "react";
import "./Battlearena.css"; // Import der CSS-Datei

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
  const [animationComplete, setAnimationComplete] = useState(false);
  const [battleLog, setBattleLog] = useState([]); // Neues Log-Array für schrittweise Anzeige
  const APP_URL = "http://172.31.44.193:3000";
  //  const APP_URL = "http://local:3000";

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
    setLoading(true);
    setError(null);
    setFightResult(null);
    setBattleLog([]); // Kampflog zurücksetzen
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
        clearInterval(interval);
        setAnimationComplete(true);
        return;
      }

      const turn = battleLog[currentTurn];

      if (turn.characterAttack > 0 && enemyHpRef.current > 0) {
        setEnemyHp((prevHp) => Math.max(0, prevHp - turn.characterAttack));
      }

      if (turn.enemyAttack > 0 && playerHpRef.current > 0) {
        setPlayerHp((prevHp) => Math.max(0, prevHp - turn.enemyAttack));
      }

      // Schrittweise das Log aktualisieren
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
    }, 1000); // Jede Runde wird alle 1 Sekunde hinzugefügt
  };

  const toggleLogVisibility = () => {
    setIsLogOpen((prev) => !prev);
  };

  return (
    <div className="battlearena">
      <h1>Battle Arena</h1>
      <div className="battle-area">
        <div className="player">
          <h2>{playerCharacter?.name}</h2>
          <img
            src={`../../logo512.png`}
            alt={playerCharacter?.name}
            className="character-img"
          />
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
              <div className="battle-log">
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
          <img src={`../../logo512.png`} alt="Bild" className="character-img" />
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
        className={`fight-button ${loading ? "disabled" : ""}`}
      >
        {loading ? "Kämpft..." : "Kämpfen"}
      </button>

      <button onClick={onBack} className="back-button">
        Zurück zur Auswahl
      </button>

      {fightResult && animationComplete && (
        <div className="fight-result">
          <h2>Kampfergebnis</h2>
          <p>{fightResult.battleSummary.message}</p>

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
        </div>
      )}

      {error && <p className="error-message">Fehler: {error}</p>}
    </div>
  );
};

export default Battlearena;
