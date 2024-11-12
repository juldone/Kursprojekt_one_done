// App.js
import React, { useState } from "react";
import RegisterForm from "./components/RegisterForm.js";
import LoginForm from "./components/LoginForm.js";
import "./components/styles.css";

const App = () => {
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");

  return (
    <div style={styles.container}>
      <h2>Register</h2>
      <RegisterForm setMessage={setMessage} />

      <h2>Login</h2>
      <LoginForm setMessage={setMessage} setToken={setToken} />

      {message && (
        <div
          style={{
            ...styles.message,
            color: message.includes("erfolgreich") ? "green" : "red",
          }}
        >
          {message}
        </div>
      )}
      {token && <div style={styles.token}>JWT Token: {token}</div>}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  },
  message: { marginTop: "20px", fontSize: "14px" },
  token: { marginTop: "20px", wordWrap: "break-word", color: "green" },
};

export default App;
