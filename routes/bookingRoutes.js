import express from 'express'
import { createBooking, getMyBookings } from '../controllers/bookingController.js'
import { protect } from '../controllers/authController.js'

const router = express.Router()

// All booking routes require login
router.use(protect)

// Create new booking
router.post('/', createBooking)

// Get current user's bookings
router.get('/me', getMyBookings)

export default router
