import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./form.css";

const LoginForm = ({ setToken, setAccountId }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Fehlernachricht für die Anzeige
  const navigate = useNavigate(); // Verwende `useNavigate` für die Navigation
  const url = "http://localhost:3000/login"; // Deine API-Login-URL

  useEffect(() => {
    // Füge die Klasse zu body hinzu
    document.body.classList.add("form-background");

    // Bereinigung nach Verlassen der Seite
    return () => {
      document.body.classList.remove("form-background");
    };
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    // Überprüfen, ob E-Mail und Passwort eingegeben wurden
    if (!email || !password) {
      setErrorMessage("Bitte E-Mail und Passwort eingeben!");
      return;
    }

    // Login-Daten an den Server schicken
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();

        // Speichern des Tokens und der Account-ID im state oder localStorage
        setToken(data.token);
        setAccountId(data.accountId);

        // Navigiere zur Account-Seite
        navigate("/account");
      } else {
        setErrorMessage("Login fehlgeschlagen! Überprüfe deine Daten.");
      }
    } catch (error) {
      setErrorMessage("Es gab ein Problem bei der Verbindung zum Server.");
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <h1> Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>

      {/* Fehlernachricht anzeigen, wenn vorhanden */}
      {errorMessage && (
        <div style={{ color: "red", marginTop: "10px" }}>{errorMessage}</div>
      )}
    </div>
  );
};

export default LoginForm;
