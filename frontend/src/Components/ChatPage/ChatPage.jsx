import React, { useEffect, useState, useMemo } from "react";
import "./ChatPage.css";
import { io } from "socket.io-client";
import {
  MdOutlineKeyboardArrowRight,
  MdArrowBackIos,
  MdMoreVert,
  MdSend,
  MdDarkMode,
  MdLock,
  MdOutlineLanguage,
  MdFavorite,
  MdLocationOn,
  MdSupport,
  MdPrivacyTip,
  MdDescription,
  MdGavel,
  MdInfo,
  MdStar,
} from "react-icons/md";

const ChatPage = ({ user, onLogout }) => {
  const [msg, setMsg] = useState("");
  const [chats, setChats] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFiltereredUsers] = useState([]);

  const token = localStorage.getItem("token");
  const socket = useMemo(() => {
    if (!token) return null;
    return io(process.env.REACT_APP_SERVER_URL || "http://localhost:4000", {
      auth: { token }
    });
  }, [token]);

  // Static general and about data (moved from Data.js)
  const general = [
    { icon: <MdDarkMode />, gname: "Dark Mode" },
    { icon: <MdLock />, gname: "Help Center" },
    { icon: <MdOutlineLanguage />, gname: "App Language" },
    { icon: <MdFavorite />, gname: "Favourite Service" },
    { icon: <MdLocationOn />, gname: "Address" },
    { icon: <MdSupport />, gname: "Support & Live chat" },
  ];

  const about = [
    { icon: <MdPrivacyTip />, gname: "Privacy Policy" },
    { icon: <MdDescription />, gname: "Terms & Conditions" },
    { icon: <MdGavel />, gname: "Legal Notices" },
    { icon: <MdInfo />, gname: "About" },
    { icon: <MdStar />, gname: "Rate Us" },
  ];

  // Generate avatar URL using ui-avatars.com API
  const getAvatarUrl = (username) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=128`;
  };

  // Fetch all users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL || "http://localhost:4000"}/users`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const users = await response.json();
          setAllUsers(users);
          setFiltereredUsers(users);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [token]);

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery === "") {
      setFiltereredUsers(allUsers);
    } else {
      const filtered = allUsers.filter((u) =>
        u.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFiltereredUsers(filtered);
    }
  }, [searchQuery, allUsers]);

  useEffect(() => {
    if (!socket) return;

    // Listen for private message history
    socket.on("private-history", (history) => {
      setChats(history);
    });

    // Listen for new private messages
    socket.on("private-message", (payload) => {
      setChats(prev => [...prev, {
        author: payload.from,
        text: payload.text,
        timestamp: payload.timestamp
      }]);
    });

    // Listen for recent contacts
    socket.on("recent-contacts", (contacts) => {
      setRecentChats(contacts);
    });

    // Handle connection errors
    socket.on("connect_error", (err) => {
      console.error("Socket error:", err.message);
    });

    // Get recent contacts when socket connects
    socket.emit("get-recent-contacts");

    return () => {
      socket.off("private-history");
      socket.off("private-message");
      socket.off("recent-contacts");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, [socket]);

  // Handle user selection for chat
  const handleUserSelect = (selectedUserObj) => {
    setSelectedUser(selectedUserObj);
    setChats([]); // Clear current chats
    
    // Load chat history with selected user
    socket.emit("load-private-history", { with: selectedUserObj._id });
  };

  const sendChat = () => {
    if (!msg || !selectedUser) return;
    
    socket.emit("private-message", { 
      to: selectedUser._id, 
      text: msg 
    });
    
    // Add message to local state immediately
    setChats(prev => [...prev, {
      author: user,
      text: msg,
      timestamp: new Date().toISOString()
    }]);
    
    setMsg('');
  };

  return (
    <div className="chat-page">
      <aside>
        <div className="profile-first">
          <img src={getAvatarUrl(user)} alt="avatar" />
          <p>{user}</p>
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
            placeholder="Search users..."
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          {/* Show recent chats when not searching */}
          {searchQuery === "" && recentChats.length > 0 && (
            <>
              <h4 style={{margin: "10px 0", color: "#666"}}>Recent Chats</h4>
              <ul>
                {recentChats.map((chat, i) => (
                  <li key={`recent-${i}`} onClick={() => handleUserSelect(chat)}>
                    <img src={getAvatarUrl(chat.username)} alt="avatar" />
                    <div>
                      <p>{chat.username}</p>
                      <p>Click to continue chat..</p>
                      <p>{new Date(chat.lastMessageAt).toLocaleDateString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
          
          {/* Show all users or filtered users */}
          <h4 style={{margin: "10px 0", color: "#666"}}>
            {searchQuery === "" ? "All Users" : "Search Results"}
          </h4>
          <ul>
            {filteredUsers.map((u, i) => {
              return (
                <li key={u._id} onClick={() => handleUserSelect(u)}>
                  <img src={getAvatarUrl(u.username)} alt="avatar" />
                  <div>
                    <p>{u.username}</p>
                    <p>Click to start chatting..</p>
                    <p></p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        
        <div>
          {selectedUser ? (
            <>
              <header className="chat-head">
                <MdArrowBackIos onClick={() => setSelectedUser(null)} />
                <img src={getAvatarUrl(selectedUser.username)} alt="head-logo" />
                <p>{selectedUser.username}</p>
                <MdMoreVert />
              </header>
              <div>
                <div>
                  {chats.map((c, i) => (
                    <div key={i} className="chat-area">
                      <div className={`container ${c.author === user ? "me" : ""}`}>
                        <p className="chatbox">
                         {c.text}
                        </p>
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
                    onKeyPress={(e) => e.key === 'Enter' && sendChat()}
                  />
                  <div className="circle-img" onClick={sendChat}>
                    <MdSend />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666'}}>
              <p>Select a user to start chatting</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ChatPage;