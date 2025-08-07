# Chat App

A modern real-time chat application built with React (frontend) and Node.js + Express + Socket.IO (backend). The app supports private messaging between users, JWT-based authentication, persistent message history with MongoDB, and dynamic avatar rendering.

---

## 🚀 Features

* Real-time **private messaging** using WebSockets via Socket.IO
* **JWT authentication** for secure login
* **MongoDB** for storing users and chat history
* **Recent contacts** and full user search
* **UI Avatars** integration for user profile images

---

## 📂 Project Structure

```
project-root/
├── backend/                 # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── index.js         # Server entry
│   │   └── ...
│   ├── .env
│   └── package.json
│
├── frontend/                # React frontend
│   ├── src/
│   │   ├── Components/
│   │   │   ├── AuthPage/
│   │   │   └── ChatPage/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── ...
│   └── package.json
```

---

## 💻 Tech Stack

### Frontend:

* React 18
* Axios
* Socket.IO Client
* React Icons
* Hamburger React (for menus)

### Backend:

* Node.js + Express 5
* MongoDB (via Mongoose)
* Socket.IO
* JWT Authentication
* bcrypt for password hashing
* dotenv for environment config

---

## 📊 Setup Instructions

### Prerequisites:

* Node.js & npm
* MongoDB (local or Atlas)

### 1. Backend Setup

```bash
cd backend
cp .env.example .env  # create your .env file
npm install
npm start
```

#### `.env` variables:

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=your_jwt_secret_key
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

You can optionally define a `.env` in `frontend/`:

```env
REACT_APP_SERVER_URL=http://localhost:4000
```

---

## 💬 Usage

1. Register or log in using your username and password.
2. See recent contacts or search users.
3. Click a contact to start chatting.
4. Messages are sent in real-time and saved to MongoDB.

---

## ✅ Todo / Improvements

* Group chats (rooms)
* Online/offline indicators
* Typing indicators
* Message read receipts
* User profile pages

---

## 🚮 License

MIT

---

## 🙏 Acknowledgements

* [Socket.IO](https://socket.io/)
* [MongoDB](https://www.mongodb.com/)
* [UI Avatars](https://ui-avatars.com/)
* [React](https://reactjs.org/)
