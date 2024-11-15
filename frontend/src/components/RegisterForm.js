import React, { useState } from "react";

const RegisterForm = ({ setMessage, setToken, setAccountId }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setuserName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/register", {
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
