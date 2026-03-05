# DevCollab

A developer collaboration platform that combines GitHub integration, real-time chat, and project management.

## Features

- **User Profiles** - GitHub OAuth integration with skills showcase
- **Project Matchmaking** - AI-powered developer matching based on skills
- **Real-time Chat** - WebSocket-based messaging per project
- **Code Snippets** - Share and collaborate on code with syntax highlighting
- **Task Board** - Kanban-style collaborative project management

## Tech Stack

### Frontend
- React + TypeScript
- Material-UI (MUI)
- Zustand (State Management)
- Socket.io-client
- Monaco Editor
- React Query

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Socket.io
- JWT Authentication
- GitHub OAuth

## Installation

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- GitHub OAuth App

### Setup

1. Clone the repository
```bash
git clone https://github.com/Kriti57/devcollab.git
cd devcollab
```

2. Install dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Environment Variables

Create `.env` files in both `client/` and `server/` directories (see `.env.example`)

4. Run the application
```bash
# Terminal 1 - Run server
cd server
npm run dev

# Terminal 2 - Run client
cd client
npm start
```

## Deployment

- Frontend: Vercel
- Backend: Railway/Render
- Database: MongoDB Atlas


## Author

Kriti Gupta - [GitHub](https://github.com/Kriti57)