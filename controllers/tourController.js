import Tour from '../models/Tour.js'
import Review from '../models/Review.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import factory from './handlerFactory.js'
import cloudinary from '../config/cloudinary.js'

export const test = catchAsync(async (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'test file',
  })
})

export const featuredTours = (req, res, next) => {
  req.query.isFeatured = 'true'
  req.query.sort = '-rating,price'
  next()
}

// ✅ Create a tour
export const createTour = catchAsync(async (req, res, next) => {
  req.body.createdBy = req.user._id // attach logged-in admin as creator
  if (req.file) {
    const uploadRes = await cloudinary.uploader.upload(req.file.path, {
      folder: 'tours',
    })
    req.body.image = uploadRes.secure_url
  }
  const tour = await Tour.create(req.body)

  res.status(201).json({ status: 'success', data: tour })
})

// ✅ Delete a tour
export const deleteTour = factory.deleteOne(Tour)

// ✅ Update a tour
export const updateTour = catchAsync(async (req, res, next) => {
  let updateData = { ...req.body }
  // If a new image is uploaded
  if (req.file) {
    const uploadRes = await cloudinary.uploader.upload(req.file.path, {
      folder: 'tours',
    })
    updateData.image = uploadRes.secure_url
  }
  const tour = await Tour.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  })
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404))
  }
  res.status(200).json({ status: 'success', data: tour })
})

// ✅ Get all tours
export const getAllTours = factory.getAll(
  Tour,
  {},
  { path: 'reviews createdBy' }
)

// ✅ Get a single tour with populated reviews
export const getTour = factory.getOne(Tour, {}, { path: 'reviews createdBy' })

// ✅ Get reviews for a specific tour (using itemId + itemType)
export const getTourReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({
    itemId: req.params.id,
    itemType: 'tour',
  })

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: { reviews },
  })
})
