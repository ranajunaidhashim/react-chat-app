import React, { useEffect, useState } from "react";
import "./ChatPage.css";
import { getDatabase, push, ref, set, onChildAdded , onValue} from "firebase/database";
// import avatar from "../../img/Rana-Junaid-Hashim.jpg";
import { general, about, chaterList } from "./Data";
import {
  MdOutlineKeyboardArrowRight,
  MdArrowBackIos,
  MdMoreVert,
  MdSend,
} from "react-icons/md";

const ChatPage = () => {
  const [msg, setMsg] = useState("");
  const [name, setName] = useState("bhai");
  const [chats, setChats] = useState([]);
  const db = getDatabase();
  const chatListRef = ref(db, "chats");

  useEffect(() => {
    // by  child added method  of firebase:
    // onChildAdded(chatListRef, (data) => {
    //   setChats((chats) => [...chats, data.val()]);
    //   console.log(data.val);
    // });
    // another method of firebase
    onValue(chatListRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const chatsData = Object.values(data);
        setChats(chatsData);
      }
      console.log(data.val);

    });
    
  }, []);
  const sendChat = () => {
    const chatRef = push(chatListRef);
    set(chatRef, {
      name,
      message: msg,
    });
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredChaterList, setFilteredChaterList] = useState(chaterList);

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

  // function filterChaterList() {
  //   if (searchQuery === "") {
  //     setFilteredChaterList(chaterList);
  //   } else {
  //     const filteredList = chaterList.filter((c) =>
  //       c.cname.toLowerCase().includes(searchQuery.toLowerCase())
  //     );
  //     setFilteredChaterList(filteredList);
  //   }
  // }

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

        <button className="btn">
          <a href="/">LOGOUT</a>
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
              {chats.map((c, i) => (
                <div key={i} className="chat-area">
                  <div className={`container ${c.name === name ? "me" : ""}`}>
                    <p className="chatbox"> {c.message}</p>
                  </div>
                  {/* <div className="container me">
                <p className="chatbox">my message is.....</p>
              </div> */}
                </div>
              ))}
            </div>

            <div className="input-send">
              <input
                type="text"
                placeholder="Write A Message"
                onInput={(e) => setMsg(e.target.value)}
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
