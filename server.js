import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './config.env' });
 

import app from './app.js';
import connectDB from './config/db.js';


process.on('uncaughtException', (err) => {
  console.error(err.name, err.message);
  console.log('Uncaught Exception! Shutting down...');
  process.exit(1);
});


// Connect to MongoDB

connectDB();

// Start the server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Visit Ethiopia API is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(err.name, err.message);
  console.log('Unhandled Rejection! Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
