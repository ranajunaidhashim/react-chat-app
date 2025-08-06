import { useState } from "react";
import "./App.css";
import ChatPage from "./Components/ChatPage/ChatPage";
import Header from "./Components/Header/Header";
import Login from "./Components/Login/Login"
import Register from "./Components/Register/Register";

function App() {

  const [user, setUser] = useState(localStorage.getItem('username') || "");
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = (username) => {
    localStorage.setItem("username", username);
    setUser(username);
  }
  const handleLogout = (username) => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    setUser("");
  }

  const handleRegisterClick = () => {
    setShowRegister((prev) => !prev);
  };

  return (
    <>
      <div className="App">
        <Header />
        {user ? (<ChatPage user={user} onLogout={handleLogout} />) :
          showRegister ? (<Register onRegistered={handleRegisterClick} />) : (
            <Login onLogin={handleLogin} onShowRegister={handleRegisterClick} />)
        }

      </div>
    </>
  );
}

export default App;
