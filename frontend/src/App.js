import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm"; // Die RegisterForm-Komponente
import Account from "./components/Accountold.js";
import "./App.css"; // Oder der Pfad, den du für das CSS verwendest
import CraftingInterface from "./components/CraftingInterface.js";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [accountId, setAccountId] = useState(localStorage.getItem("accountId"));
  const [isRegistering, setIsRegistering] = useState(false); // Zustandsvariable für das Umschalten zwischen Login und Registrierung
  const [message, setMessage] = useState(""); // Zustand für die Anzeige von Nachrichten

  useEffect(() => {
    // Speichern des Tokens und der Account-ID im localStorage
    if (token) {
      localStorage.setItem("token", token);
    }
    if (accountId) {
      localStorage.setItem("accountId", accountId);
    }
  }, [token, accountId]);

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

        {/* Neue Crafting-Route */}
      </Routes>
    </Router>
  );
};

export default App;
