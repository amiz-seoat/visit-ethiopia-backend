import Review from '../models/Review.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import factory from './handlerFactory.js'

// Test
export const test = catchAsync(async (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'test file',
  })
})

// Admin: Get all pending reviews
export const getPendingReviews = factory.getAll(Review, { status: 'pending' })

// Admin: Approve review
export const approveReview = factory.updateOne(Review)

// ✅ User: Create new review
export const createReview = catchAsync(async (req, res, next) => {
  const newReview = await Review.create({
    user: req.user.id, // taken from logged in user
    itemType: req.body.itemType,
    itemId: req.body.itemId,
    rating: req.body.rating,
    title: req.body.title,
    comment: req.body.comment,
    images: req.body.images || [],
    dateOfExperience: req.body.dateOfExperience,
  })

  res.status(201).json({
    status: 'success',
    data: newReview,
  })
})

// ✅ User: Get current user's reviews
export const getMyReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ user: req.user.id })

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: reviews,
  })
})
