import React, { useState } from "react";
import axios from "axios";
import './Login.css';

export default function Login({ onLogin, onShowRegister }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const submit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_SERVER_URL}/auth/login`,
                { username, password }
            );
            const { token, username: user } = res.data;
            localStorage.setItem("token", token);
            onLogin(user);
        } catch (err) {
            setError(err.response?.data?.error || "Login failed");
        }
    };

    return (
        <div className="login">

        
        <form className="login-form" onSubmit={submit}>
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <input
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
            />
            <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
            />
            <button type="submit">Log In</button>
            <p className="switch">
                Don't have an account?{" "}
                <button
                    type="button"
                    className="link-button"
                    onClick={() => onShowRegister && onShowRegister()}>
                    Sign up
                </button>
            </p>
        </form>
        </div>
    );
}
