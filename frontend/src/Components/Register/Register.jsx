import React, { useState } from "react";
import axios from "axios";
import "./Register.css";

export default function Register({ onRegistered }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/auth/register`,
        { username, password }
      );
      setSuccess("Registration successful! Please log in.");
      // notify parent to show login form
      onRegistered && onRegistered();
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="register-page">
      <form className="register-form" onSubmit={submit}>
        <h2>Sign Up</h2>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          placeholder="Confirm Password"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        <button type="submit">Register</button>
        <p className="switch">
          Already have an account?{" "}
          <button
            type="button"
            className="link-button"
            onClick={() => onRegistered && onRegistered()}
          >
            Log in
          </button>
        </p>
      </form>
    </div>
  );
}
