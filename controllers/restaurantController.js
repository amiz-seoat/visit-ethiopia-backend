import Restaurant from '../models/Restaurants.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import factory from './handlerFactory.js'
import cloudinary from '../config/cloudinary.js'

// Test route
export const test = catchAsync(async (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'test file',
  })
})

// Filter for featured restaurants
export const featuredRestaurants = (req, res, next) => {
  req.query.isFeatured = 'true'
  req.query.sort = '-rating,price'
  next()
}

// ✅ Create a restaurant (Admin only)
export const createRestaurant = catchAsync(async (req, res, next) => {
  req.body.createdBy = req.user.id // attach logged-in admin as creator

  if (req.file) {
    const uploadRes = await cloudinary.uploader.upload(req.file.path, {
      folder: 'restaurants',
    })
    req.body.image = uploadRes.secure_url
  }
  const restaurant = await Restaurant.create(req.body)

  res.status(201).json({
    status: 'success',
    data: {
      restaurant,
    },
  })
})

// ✅ Get reviews for a specific restaurant
export const getRestaurantReviews = catchAsync(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.params.id).populate({
    path: 'reviews',
    populate: {
      path: 'user',
      select: 'FirstName LastName email',
    },
  })

  if (!restaurant) {
    return next(new AppError('No restaurant found with that ID', 404))
  }

  res.status(200).json({
    status: 'success',
    results: restaurant.reviews.length,
    data: {
      reviews: restaurant.reviews,
    },
  })
})

// Other handlers
export const getAllRestaurants = factory.getAll(
  Restaurant,
  {},
  { path: 'reviews createdBy' }
)
export const getRestaurant = factory.getOne(
  Restaurant,
  {},
  {
    path: 'reviews createdBy',
  }
)
export const updateRestaurant = catchAsync(async (req, res, next) => {
  let updateData = { ...req.body }
  // If a new image is uploaded
  if (req.file) {
    const uploadRes = await cloudinary.uploader.upload(req.file.path, {
      folder: 'restaurants',
    })
    updateData.image = uploadRes.secure_url
  }
  const restaurant = await Restaurant.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  )
  if (!restaurant) {
    return next(new AppError('No restaurant found with that ID', 404))
  }
  res.status(200).json({
    status: 'success',
    data: restaurant,
  })
})
export const deleteRestaurant = factory.deleteOne(Restaurant)
