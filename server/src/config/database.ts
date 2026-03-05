import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);

  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB Disconnected');
  });

  mongoose.connection.on('error', (err: Error) => {
    console.error('MongoDB Error:', err);
  });
};

export default connectDB;