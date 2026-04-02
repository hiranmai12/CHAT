A full-stack real-time chat application with private and group messaging, built using the MERN stack and WebSockets.

### Features
- Real-time messaging using Socket.IO
- Private 1-to-1 chat
- Group chat creation
- Add users to group
- Search users
- Send images/files
- Persistent chat history (MongoDB)
- Authentication (JWT-based)
- Responsive UI
### Tech Stack
- Frontend: React.js, CSS
- Backend: Node.js, Express.js
- Database: MongoDB
- Real-time: Socket.IO
- Auth: JWT, bcrypt
### Prerequisites

Make sure you have installed:

- Node.js (v18 or above recommended)
- npm (v9 or above)
- MongoDb

### Project Structure
```chattt/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── server.js
│
├── frontend/
│   ├── src/
│   ├── App.js
│
└── README.md```

### Setup Backend

```cd backend
npm install
npm init -y
npm install express mongoose cors dotenv bcryptjs jsonwebtoken multer socket.io
```

### RUN
```node server.js```

### Setup Frontend
``` 
cd frontend
npm install
npx create-react-app .
npm install axios socket.io-client
npm install react-icons
```
### Run
```
npm start
```
