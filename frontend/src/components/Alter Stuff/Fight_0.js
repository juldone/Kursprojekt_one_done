import React, { useState, useEffect } from "react";

const Fight = () => {
  const [accountId, setAccountId] = useState(null); // Account ID
  const [characterId, setCharacterId] = useState(""); // Charakter-ID
  const [characters, setCharacters] = useState([]); // Liste der Charaktere
  const [loadingCharacters, setLoadingCharacters] = useState(true); // Ladezustand für Charaktere
  const [token, setToken] = useState(""); // JWT Token
  const [error, setError] = useState(null); // Fehlerzustand

  useEffect(() => {
    const storedAccountId = localStorage.getItem("accountId");
    const storedToken = localStorage.getItem("token");

    if (storedAccountId && storedToken) {
      setAccountId(storedAccountId);
      setToken(storedToken);
      fetchCharacters(storedAccountId, storedToken); // Hole die Charaktere für den Account
    }
  }, []);

  const fetchCharacters = async (accountId, token) => {
    setLoadingCharacters(true);
    try {
      const response = await fetch(`http://localhost:3000/user/${accountId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Fehler beim Abrufen der Charaktere.");
      }

      const data = await response.json();

      if (data && data.characters) {
        setCharacters(data.characters);
      } else {
        throw new Error("Keine Charaktere gefunden.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingCharacters(false);
    }
  };

  const handleFight = () => {
    if (!characterId) {
      setError("Bitte wähle einen Charakter aus.");
      return;
    }

    const selectedCharacter = characters.find(
      (character) => character._id === characterId
    );

    const opponent = {
      name: "Zufälliger Gegner",
      level: Math.floor(Math.random() * 50) + 1,
      hp: Math.floor(Math.random() * 100) + 50,
    };

    const playerHp = Math.floor(Math.random() * 100) + 50;

    let fightWindow = window.open("", "fightWindow", "width=800,height=500");

    if (!fightWindow || fightWindow.closed) {
      fightWindow = window.open("", "fightWindow", "width=800,height=500");
    }

    fightWindow.document.body.innerHTML = `
      <html>
      <head>
        <title>Kampf</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            height: 100%;
            margin: 0;
          }
          .character {
            flex: 1;
            text-align: center;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 10px;
          }
          .fight-button {
            flex: 1;
            text-align: center;
          }
          button {
            padding: 15px 30px;
            font-size: 20px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 10px;
            cursor: pointer;
          }
          button:disabled {
            background-color: #ccc;
            cursor: not-allowed;
          }
          h2 {
            margin: 10px 0;
          }
          .hp {
            color: green;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="character" id="player">
          <h2>Dein Charakter</h2>
          <p><strong>Name:</strong> ${selectedCharacter.name}</p>
          <p><strong>Level:</strong> ${selectedCharacter.level}</p>
          <p><strong>HP:</strong> <span class="hp">${playerHp}</span></p>
        </div>

        <div class="fight-button">
          <button id="fightButton">Let's Fight!</button>
          <div id="result" style="margin-top: 20px;"></div>
        </div>

        <div class="character" id="opponent">
          <h2>Gegner</h2>
          <p><strong>Name:</strong> ${opponent.name}</p>
          <p><strong>Level:</strong> ${opponent.level}</p>
          <p><strong>HP:</strong> <span class="hp">${opponent.hp}</span></p>
        </div>
      </body>
      </html>
    `;

    const fightButton = fightWindow.document.getElementById("fightButton");
    const resultDiv = fightWindow.document.getElementById("result");

    fightButton.addEventListener("click", async () => {
      resultDiv.textContent = "Kampf wird ausgelöst...";
      try {
        const response = await fetch("http://localhost:3000/battle", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            accountId,
            characterId,
          }),
        });

        if (!response.ok) {
          throw new Error("Fehler beim Kampf.");
        }

        const data = await response.json();
        resultDiv.innerHTML = `
          <h3>Kampfergebnis:</h3>
          <p>${data.message}</p>
          ${
            data.drops
              ? `<h4>Erhaltene Drops:</h4>
                 <ul>${data.drops
                   .map((drop) => `<li>${drop.quantity}x ${drop.material}</li>`)
                   .join("")}</ul>`
              : ""
          }
        `;
      } catch (err) {
        resultDiv.textContent = `Fehler: ${err.message}`;
      }
    });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Kampfmodus</h1>
      <p>
        Wähle einen Charakter aus und drücke auf Kämpfen, um den Kampf zu
        starten!
      </p>

      {loadingCharacters ? (
        <p>Charaktere werden geladen...</p>
      ) : (
        <div style={{ marginBottom: "20px" }}>
          <select
            value={characterId}
            onChange={(e) => setCharacterId(e.target.value)}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            <option value="">Wähle einen Charakter</option>
            {characters.map((character) => (
              <option key={character._id} value={character._id}>
                {character.name} (Level {character.level})
              </option>
            ))}
          </select>
        </div>
      )}

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={handleFight}
          disabled={!characterId}
          style={{
            marginLeft: "10px",
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: characterId ? "#007bff" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: characterId ? "pointer" : "not-allowed",
          }}
        >
          Kämpfen!
        </button>
      </div>

      {error && <p style={{ color: "red" }}>Fehler: {error}</p>}
    </div>
  );
};

export default Fight;
