import React, { useState, useEffect, useCallback } from "react";

const BattleArena = ({ token, accountId }) => {
  const [character, setCharacter] = useState(null);
  const [enemy, setEnemy] = useState(null);
  const [characterHp, setCharacterHp] = useState(0);
  const [enemyHp, setEnemyHp] = useState(0);
  const [battleLog, setBattleLog] = useState([]);
  const [isBattleActive, setIsBattleActive] = useState(true);
  const [error, setError] = useState("");

  const fetchBattleData = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3000/battle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          accountId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ein Fehler ist aufgetreten.");
      }

      const data = await response.json();
      setCharacter(data.character);
      setEnemy(data.enemy);
      setCharacterHp(data.character.hp);
      setEnemyHp(data.enemy.hp);
    } catch (err) {
      setError(err.message);
    }
  }, [token, accountId]);

  useEffect(() => {
    fetchBattleData();
  }, [fetchBattleData]);

  return (
    <div className="battle-arena">
      <h2>Battle Arena</h2>
      <div className="stats">
        <div>
          {character?.name || "Charakter"} HP: {characterHp}
        </div>
        <div>
          {enemy?.name || "Gegner"} HP: {enemyHp}
        </div>
      </div>
      <button disabled={!isBattleActive}>Angriff</button>
      {battleLog.length > 0 && (
        <div>
          <h3>Kampflog:</h3>
          <ul>
            {battleLog.map((log, index) => (
              <li key={index}>
                Runde {index + 1}: {log}
              </li>
            ))}
          </ul>
        </div>
      )}
      {!isBattleActive && (
        <div>
          <h3>
            {characterHp > 0 ? "Du hast gewonnen!" : "Du wurdest besiegt!"}
          </h3>
        </div>
      )}
    </div>
  );
};

export default BattleArena;
