import { useState } from "react";

// BattleLogComponent ist verantwortlich für die Berechnung der Kampfrunden und das Anzeigen des Logs
function BattleLogComponent({ character, enemy, rewards }) {
  const [battleLog, setBattleLog] = useState([]);
  const [characterHp, setCharacterHp] = useState(character.stats.hp);
  const [enemyHp, setEnemyHp] = useState(enemy.stats.health);
  const [isBattleFinished, setIsBattleFinished] = useState(false);

  // Startet die Kampflogik
  const startBattle = () => {
    let log = [];
    let currentCharacterHp = characterHp;
    let currentEnemyHp = enemyHp;

    // Solange der Kampf läuft
    while (currentCharacterHp > 0 && currentEnemyHp > 0) {
      // Charakter greift an
      const characterAttack = Math.max(
        0,
        character.stats.attack - enemy.stats.defense
      );
      currentEnemyHp -= characterAttack;

      log.push({
        round: log.length + 1,
        characterAttack,
        enemyAttack: 0,
        characterHp: currentCharacterHp,
        enemyHp: Math.max(0, currentEnemyHp),
      });

      // Prüfen, ob der Gegner besiegt wurde
      if (currentEnemyHp <= 0) {
        break;
      }

      // Gegner greift an
      const enemyAttack = Math.max(
        0,
        enemy.stats.attack - character.stats.defense
      );
      currentCharacterHp -= enemyAttack;

      log.push({
        round: log.length + 1,
        characterAttack: 0,
        enemyAttack,
        characterHp: Math.max(0, currentCharacterHp),
        enemyHp: currentEnemyHp,
      });

      // Prüfen, ob der Charakter besiegt wurde
      if (currentCharacterHp <= 0) {
        break;
      }
    }

    setBattleLog(log);
    setIsBattleFinished(true); // Kampf beendet
  };

  return (
    <div>
      <h2>Battle Log</h2>
      <button onClick={startBattle}>Start Battle</button>
      <div>
        {battleLog.length === 0 ? (
          <p>Der Kampf hat noch nicht begonnen.</p>
        ) : (
          battleLog.map((entry, index) => (
            <div key={index}>
              <p>
                Round {entry.round}: Character Attack: {entry.characterAttack},
                Enemy Attack: {entry.enemyAttack}
              </p>
              <p>
                Character HP: {entry.characterHp}, Enemy HP: {entry.enemyHp}
              </p>
            </div>
          ))
        )}
      </div>
      {isBattleFinished && (
        <div>
          <h3>Kampf beendet!</h3>
          <p>
            {characterHp > 0
              ? `${character.name} hat den Gegner besiegt!`
              : `${enemy.name} hat ${character.name} besiegt!`}
          </p>
          {rewards && <p>Belohnungen: {JSON.stringify(rewards)}</p>}
        </div>
      )}
    </div>
  );
}

export default BattleLogComponent;
