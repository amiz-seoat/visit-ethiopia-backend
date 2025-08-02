import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import globalErrorHandler from './controllers/errorController.js';
import AppError from './utils/appError.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import router from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger/swagger.js';
import cors from 'cors';

// Define __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: './config.env' });
}

const app = express();

// ✅ Trust proxy headers from Vercel
app.set('trust proxy', 1);

// CORS middleware
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://visit-ethiopia-frontend.vercel.app',
    ],
    credentials: true,
  })
);

// Swagger docs route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware
app.use(cookieParser());
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use(xss());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Test Route for Vercel/health check
app.get('/', (req, res) => {
  res.send('API is working');
});

// Main API routes
app.use('/api/v1/users', router);

// Catch unmatched routes
app.all(/(.*)/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`));
});

// Global error handler
app.use(globalErrorHandler);

export default app;
