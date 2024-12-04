import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ setToken, setAccountId }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Verwende `useNavigate` für die Navigation
  const url = "http://localhost:3000/login"; // Deine API-Login-URL

  const handleLogin = async (event) => {
    event.preventDefault();

    // Login-Daten an den Server schicken
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
      alert("Login fehlgeschlagen!");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
