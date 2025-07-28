import express from 'express'
import path from 'path'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import xss from 'xss-clean'
import globalErrorHandler from './controllers/errorController.js'
import AppError from './utils/appError.js'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import router from './routes/authRoutes.js'
import cookieParser from 'cookie-parser'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './swagger/swagger.js'

// Define __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: './config.env' })

const app = express()
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use(cookieParser())

// Global Middleware
// Set security HTTP headers
app.use(helmet())

// Limit requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
})
app.use('/api', limiter)
app.use(express.json({ limit: '10kb' }))
// Data sanitization against NoSQL injection
app.use(mongoSanitize())
// Data sanitization against XSS
app.use(xss())
// Serving static files
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/api/v1/users', router)

// Handle unmatched routes
app.all(/(.*)/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`))
})

// Global error handler
app.use(globalErrorHandler)

export default app
