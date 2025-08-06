import Booking from '../models/Booking.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'

export const test = catchAsync(async (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'test file',
  })
})
