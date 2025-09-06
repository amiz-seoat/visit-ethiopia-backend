import dotenv from 'dotenv'
import app from './app.js'
import connectDB from './config/db.js'

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: './config.env' })
}

// ✅ Connect to MongoDB once when the function is initialized
try {
  await connectDB()
} catch (error) {
  console.error('Failed to connect to database:', error)
  // Don't throw in serverless environment, let individual requests handle DB errors
}

// ✅ Export app instead of listening to a port
export default app
