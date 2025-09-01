import Booking from '../models/Booking.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'

// Create new booking
export const createBooking = catchAsync(async (req, res, next) => {
  const {
    bookingType,
    bookingItem,
    bookingDetails,
    contactInfo,
    payment,
    notes,
  } = req.body

  // Validate required fields one by one for better error messages
  if (!bookingType) return next(new AppError('bookingType is required', 400))
  if (!bookingItem) return next(new AppError('bookingItem is required', 400))

  if (!contactInfo) return next(new AppError('contactInfo is required', 400))
  if (!contactInfo.fullName)
    return next(new AppError('contactInfo.fullName is required', 400))
  if (!contactInfo.email)
    return next(new AppError('contactInfo.email is required', 400))
  if (!contactInfo.phone)
    return next(new AppError('contactInfo.phone is required', 400))

  if (!payment) return next(new AppError('payment is required', 400))
  if (!payment.amount)
    return next(new AppError('payment.amount is required', 400))
  if (!payment.paymentMethod)
    return next(new AppError('payment.paymentMethod is required', 400))

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
  const bookings = await Booking.find({ user: req.user.id }).sort({
    createdAt: -1,
  })

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: bookings,
  })
})
