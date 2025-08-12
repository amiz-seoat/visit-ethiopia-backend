import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: './config.env' });
}


// ✅ Connect to MongoDB once when the function is initialized
connectDB();


// ✅ Export app instead of listening to a port
export default app;
