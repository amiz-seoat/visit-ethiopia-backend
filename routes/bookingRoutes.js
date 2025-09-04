import express from 'express'
import {
  createBooking,
  getBooking,
  getMyBookings,
  cancelBooking,
  updateBookingStatus,
} from '../controllers/bookingController.js'
import { protect, restrict } from '../controllers/authController.js'

const router = express.Router()

// All booking routes require login
router.use(protect)

// Create new booking
router.post('/', protect, createBooking)

// Get a booking by id (owner or admin)
router.get('/:id', protect, getBooking)

// Get current user's bookings
router.get('/me', protect, getMyBookings)
// Cancel a booking
router.patch('/:id/cancel', protect, cancelBooking)
// Update a booking
router.patch('/:id/status', protect, restrict('admin'), updateBookingStatus)

export default router
