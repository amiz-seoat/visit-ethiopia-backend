import Booking from '../models/Booking.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'

// Create new booking
export const createBooking = catchAsync(async (req, res, next) => {
  const { bookingType, bookingItem, bookingDetails, contactInfo, payment, notes } = req.body

  // Ensure required fields
  if (!bookingType || !bookingItem || !contactInfo?.fullName || !contactInfo?.email || !contactInfo?.phone || !payment?.amount || !payment?.paymentMethod) {
    return next(new AppError('Missing required booking fields', 400))
  }

  const booking = await Booking.create({
    user: req.user.id, // from auth middleware
    bookingType,
    bookingItem,
    bookingDetails,
    contactInfo,
    payment,
    notes,
  })

  res.status(201).json({
    status: 'success',
    data: booking,
  })
})

// Get current user's bookings
export const getMyBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id }).sort({ createdAt: -1 })

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: bookings,
  })
})
