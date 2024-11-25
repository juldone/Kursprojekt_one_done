import React, { useState, useEffect } from "react";
import "./form.css";

const RegisterForm = ({ setMessage, setToken, setAccountId }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setuserName] = useState("");
  const APP_URL = "http://172.31.44.193:3000";
  //  const APP_URL = "http://local:3000";

  useEffect(() => {
    // Füge die Klasse zu body hinzu
    document.body.classList.add("form-background");

    // Bereinigung nach Verlassen der Seite
    return () => {
      document.body.classList.remove("form-background");
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${APP_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, userName }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Registration successful!");
        setToken(data.token);
        setAccountId(data.accountId);
      } else {
        setMessage(data.message || "Registration failed");
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Registrierung</h1>
      <label>Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <label>Username:</label>
      <input
        type="text"
        value={userName}
        onChange={(e) => setuserName(e.target.value)}
        required
      />
      <label>Password:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Registrieren</button>
    </form>
  );
};

export default RegisterForm;
