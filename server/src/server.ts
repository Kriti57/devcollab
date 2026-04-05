import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database';
import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';

dotenv.config();

const app: Express = express();

const PORT = process.env.PORT || 5000;

// Middleware
// ==========

// 1. CORS - Allow frontend to communicate with backend
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

// 2. Body Parser - Parse JSON request bodies
app.use(express.json());

// 3. URL Encoded - Parse URL-encoded data
app.use(express.urlencoded({ extended: true }));


// Routes
// ======

// Auth routes
app.use('/api/auth', authRoutes);
// Project routes
app.use('/api/projects', projectRoutes);

// Health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'DevCollab API is running!',
    timestamp: new Date().toISOString(),
  });
});

// Test route
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to DevCollab API');
});

// 404 Handler - Catch all undefined routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Start Server Function
// =====================
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🚀 DevCollab Server Started!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`📍 Server: http://localhost:${PORT}`);
      console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.log('⚠️  UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

startServer();

export default app;