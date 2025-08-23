import Review from '../models/Review.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import factory from './handlerFactory.js'

export const test = catchAsync(async (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'test file',
  })
})

export const getPendingReviews = factory.getAll(
  Review,
  { status: 'pending' },
  { path: 'user itemId' }
)

export const approveReview = factory.updateOne(Review)
