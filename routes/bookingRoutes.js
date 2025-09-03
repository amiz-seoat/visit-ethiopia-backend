import express from 'express'
import {
  createBooking,
  getMyBookings,
  cancelBooking,
  updateBooking,
} from '../controllers/bookingController.js'
import { protect } from '../controllers/authController.js'

const router = express.Router()

// All booking routes require login
router.use(protect)

// Create new booking
router.post('/', protect, createBooking)

// Get current user's bookings
router.get('/me', protect, getMyBookings)
// Cancel a booking
router.patch('/:id/cancel', protect, cancelBooking)
// Update a booking
router.patch('/:id', protect, updateBooking)

export default router
