# DevCollab

A developer collaboration platform that combines GitHub integration, real-time chat, and project management.

## Features

### Implemented
- **User Authentication**
  - Registration with email validation
  - Login with JWT tokens
  - Password hashing with bcrypt
  - Protected routes middleware
  - Get and update user profile

- **Project Management**
  - Create, read, update, delete projects
  - User-project relationships
  - Project filtering by creator
  - Tech stack tracking
  - Looking for roles feature
  - GitHub repository integration
  - Project status tracking (planning, active, completed, on-hold)

- **Database**
  - MongoDB Atlas cloud database
  - Mongoose ODM with schemas and validation
  - User and Project models with relationships
  - Data population for related documents

### Coming Soon
- Real-time chat with Socket.io
- GitHub OAuth integration
- Project matchmaking algorithm
- Task board (Kanban style)
- Code snippet sharing with Monaco Editor
- Collaborative features

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

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project (Protected)
- `GET /api/projects/my/projects` - Get user's projects (Protected)
- `PUT /api/projects/:id` - Update project (Protected)
- `DELETE /api/projects/:id` - Delete project (Protected)

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
