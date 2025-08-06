import React, { useEffect, useState, useMemo } from "react";
import "./ChatPage.css";
import { io } from "socket.io-client";
import { general, about, chaterList } from "./Data";
import {
  MdOutlineKeyboardArrowRight,
  MdArrowBackIos,
  MdMoreVert,
  MdSend,
} from "react-icons/md";

const ChatPage = ({ user, onLogout }) => {
  const [msg, setMsg] = useState("");
  const [chats, setChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredChaterList, setFilteredChaterList] = useState(chaterList);

  const token = localStorage.getItem("token");
  const socket = useMemo(() => {
    if (!token) return null;
    return io(process.env.REACT_APP_SERVER_URL || "http://localhost:4000", {
      auth: { token }
    });
  }, [token]);

  useEffect(() => {
    if (!socket) return;                        // ← guard against null
    // history listener
    socket.on("chat-history", history => {
      const flat = history.map(h => ({
        author: typeof h.author === "string"
          ? h.author
          : h.author.username,
        text: h.text,
        timestamp: h.timestamp
      }));
      setChats(flat);
    });
    // new-message listener
    socket.on("receive-message", payload => {
      setChats(prev => [...prev, payload]);
    });
    // handle connection errors
    socket.on("connect_error", err => {
      console.error("Socket error:", err.message);
    });
    return () => {
      socket.off("chat-history");
      socket.off("receive-message");
      socket.off("connect_error");
      socket.disconnect();
    }

  }, [socket]);

  const sendChat = () => {
    if (!msg) return;
    // const payload = { name, message: msg }
    // socket.emit('send-message', payload);
    // setChats((prev) => ([...prev, payload]))
    socket.emit("send-message", { message: msg });
    setMsg('');
  };



  useEffect(() => {
    function filterChaterList() {
      if (searchQuery === "") {
        setFilteredChaterList(chaterList);
      } else {
        const filteredList = chaterList.filter((c) =>
          c.cname.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredChaterList(filteredList);
      }
    }
    filterChaterList();
  }, [searchQuery]);


  return (
    <div className="chat-page">
      <aside>
        <div className="profile-first">
          <img src="https://res.cloudinary.com/dsr70k3to/image/upload/v1687612965/Portfolio/Rana_Junaid_Hashim.jpg" alt="avatar" />
          <p>Junaid Rana</p>

          <button className="btn">
            <a href="/">EDIT PROFILE</a>
          </button>
        </div>
        <div className="profile-general">
          <span>General</span>
          <ul>
            {general.map((p, i) => {
              return (
                <li key={i}>
                  {p.icon}
                  <p>{p.gname}</p>
                  <MdOutlineKeyboardArrowRight />
                </li>
              );
            })}
          </ul>
        </div>
        <div className="profile-general">
          <span>About App</span>
          <ul>
            {about.map((p, i) => {
              return (
                <li key={i}>
                  {p.icon}
                  <p>{p.gname}</p>
                </li>
              );
            })}
          </ul>
        </div>

        <button className="btn" onClick={() => onLogout && onLogout()}>
          LOGOUT
        </button>
      </aside>
      <section>
        <div className="chat-list">
          <input
            placeholder="Search"
            type="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              // filterChaterList();
            }}
          />
          <ul>
            {filteredChaterList.map((c, i) => {
              return (
                <li key={i}>
                  <img src={c.cavatar} alt="avatar" />
                  <div>
                    <p>{c.cname}</p>
                    <p>lorem ipsum dolor sit amet...</p>
                    <p>2:30 PM</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <header className="chat-head">
            <MdArrowBackIos />
            <img src={chaterList[0].cavatar} alt="head-logo" />
            <p>{chaterList[0].cname}</p>
            <MdMoreVert />
          </header>
          <div>
            <div>
              {/* {!socket? <div>Connecting…</div>:""} */}
              {chats.map((c, i) => (
                <div key={i} className="chat-area">
                  <div className={`container ${c.author === user ? "me" : ""}`}>
                    <p className="chatbox"> {c.author === user ? "" : <strong>{c.author}:</strong>} {c.text}</p>
                    <small>{new Date(c.timestamp).toLocaleTimeString()}</small>
                  </div>
                </div>
              ))}
            </div>

            <div className="input-send">
              <input
                type="text"
                placeholder="Write A Message"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
              />
              <div className="circle-img" onClick={(e) => sendChat()}>
                <MdSend />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChatPage;
