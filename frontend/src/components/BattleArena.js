import React, { useState, useEffect } from "react";

const BattleArena = ({ battleResult, onBack }) => {
  const [currentRound, setCurrentRound] = useState(0); // Aktuelle Runde des Kampfes
  const [log, setLog] = useState([]); // Log der sichtbaren Runden
  const [characterHp, setCharacterHp] = useState(
    battleResult.battleLog[0].characterHp
  );
  const [enemyHp, setEnemyHp] = useState(battleResult.battleLog[0].enemyHp);

  useEffect(() => {
    if (currentRound < battleResult.battleLog.length) {
      const roundData = battleResult.battleLog[currentRound];
      const delay = 1000; // 1 Sekunde Verzögerung zwischen den Runden

      const timer = setTimeout(() => {
        // Log-Einträge aktualisieren
        setLog((prevLog) => [...prevLog, roundData]);
        // HPs aktualisieren
        setCharacterHp(roundData.characterHp);
        setEnemyHp(roundData.enemyHp);
        // Runde erhöhen
        setCurrentRound((prevRound) => prevRound + 1);
      }, delay);

      return () => clearTimeout(timer); // Cleanup für Timer
    }
  }, [currentRound, battleResult.battleLog]);

  const renderHpBar = (hp, maxHp) => {
    const percentage = Math.max(0, (hp / maxHp) * 100); // Prozentuale Breite
    return (
      <div style={{ marginBottom: "10px" }}>
        <div
          style={{
            width: "100%",
            backgroundColor: "#ddd",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${percentage}%`,
              backgroundColor: percentage > 50 ? "green" : "red",
              height: "20px",
              transition: "width 0.5s ease",
            }}
          ></div>
        </div>
        <p
          style={{
            textAlign: "center",
            margin: "5px 0",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          {Math.max(0, hp)} HP
        </p>
      </div>
    );
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>
        {currentRound >= battleResult.battleLog.length
          ? battleResult.winner === "character"
            ? "Du hast gewonnen!"
            : "Du hast verloren!"
          : "Kampf läuft..."}
      </h2>
      <div style={{ marginBottom: "20px" }}>
        <h3>Dein Charakter:</h3>
        {renderHpBar(characterHp, battleResult.battleLog[0].characterHp)}
        <h3>Gegner:</h3>
        {renderHpBar(enemyHp, battleResult.battleLog[0].enemyHp)}
      </div>
      <div>
        <h3>Kampfverlauf:</h3>
        <ul>
          {log.map((entry, index) => {
            console.log(entry.characterAttack);
            console.log(entry.enemyAttackAttack); // Hier außerhalb der JSX
            return (
              <li key={index}>
                Runde {entry.round}:{" "}
                {entry.characterAttack > 0
                  ? `Charakter greift an mit ${entry.characterAttack} Schaden`
                  : `Gegner greift an mit ${entry.enemyAttack} Schaden`}
              </li>
            );
          })}
        </ul>
      </div>
      {currentRound >= battleResult.battleLog.length && (
        <button
          onClick={onBack}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Zurück
        </button>
      )}
    </div>
  );
};

export default BattleArena;
