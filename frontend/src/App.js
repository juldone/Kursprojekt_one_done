import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm"; // Die RegisterForm-Komponente
import Account from "./components/Account";
import "./App.css"; // Oder der Pfad, den du für das CSS verwendest
import CraftingInterface from "./components/CraftingInterface.js";
import Fight from "./components/Fight.js";
import BattleArena from "./components/BattleArena/BattleArena.js"; // Importiere die BattleArena-Komponente

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [accountId, setAccountId] = useState(localStorage.getItem("accountId"));
  const [isRegistering, setIsRegistering] = useState(false); // Zustandsvariable für das Umschalten zwischen Login und Registrierung
  const [message, setMessage] = useState(""); // Zustand für die Anzeige von Nachrichten
  const [battleData, setBattleData] = useState(null); // Zustand für den Kampf
  const [loading, setLoading] = useState(false); // Zustand für das Laden der Daten

  useEffect(() => {
    // Speichern des Tokens und der Account-ID im localStorage
    if (token) {
      localStorage.setItem("token", token);
    }
    if (accountId) {
      localStorage.setItem("accountId", accountId);
    }
  }, [token, accountId]);

  // Funktion, um den Kampf zu starten
  const startBattle = async () => {
    setLoading(true);
    try {
      // Anfrage an das Backend senden, um die Kampfdaten zu holen
      const response = await fetch("http://localhost:3000/battle", {
        method: "POST",
        body: JSON.stringify({
          characterId: "123", // Ersetze mit der tatsächlichen Charakter-ID
          accountId: "456", // Ersetze mit der tatsächlichen Account-ID
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Fehler beim Abrufen der Kampfdaten");
      }

      const data = await response.json();
      setBattleData(data); // Speichere die empfangenen Daten im Zustand
    } catch (error) {
      console.error("Fehler beim Starten des Kampfes:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            // Die Login- und Register-Formulare werden hier auf derselben Seite angezeigt
            <>
              {isRegistering ? (
                <RegisterForm
                  setMessage={setMessage}
                  setToken={setToken}
                  setAccountId={setAccountId}
                />
              ) : (
                <LoginForm
                  setMessage={setMessage}
                  setToken={setToken}
                  setAccountId={setAccountId}
                />
              )}
              <button
                className="no-reg-btn"
                onClick={() => setIsRegistering(!isRegistering)}
              >
                {isRegistering
                  ? "Already have an account? Log in"
                  : "Don't have an account? Register"}
              </button>
              {message && <div className="message">{message}</div>}{" "}
              {/* Zeige die Nachricht */}
            </>
          }
        />
        <Route path="/account" element={<Account />} />
        <Route
          path="/user/:accountId/crafting"
          element={<CraftingInterface />}
        />
        <Route
          path="/battle"
          element={
            <Fight
              startBattle={startBattle}
              battleData={battleData}
              loading={loading}
            />
          }
        />
        {/* Hier wird die BattleArena-Komponente eingefügt */}
        <Route
          path="/battlearena"
          element={
            <BattleArena
              character={battleData?.character}
              enemy={battleData?.enemy}
            />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
