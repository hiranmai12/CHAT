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
```
chattt/
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
└── README.md
```

### Setup Backend

```cd backend
npm install
npm init -y
npm install express mongoose cors dotenv bcryptjs jsonwebtoken multer socket.io
```

### RUN
```
node server.js
```

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

### Output
<img width="696" height="642" alt="login" src="https://github.com/user-attachments/assets/b644d6ce-73d8-41c3-a9af-d59b821820b8" />
<img width="599" height="563" alt="register" src="https://github.com/user-attachments/assets/90dbdc6d-d06a-4b9d-adc3-41b0b7e1b668" />
<img width="1920" height="901" alt="user-1" src="https://github.com/user-attachments/assets/65f21a3b-4474-4d3a-924b-dbc849ef1a1a" />
<img width="1920" height="886" alt="user-2" src="https://github.com/user-attachments/assets/2274158e-521c-4906-906b-114a5bfa97e5" />




