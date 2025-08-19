import Hotel from '../models/Hotel.js'
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

export const featuredHotels = (req, res, next) => {
  req.query.isFeatured = 'true'
  req.query.sort = '-averageRating,price'
  next()
}

// ✅ CRUD
export const createHotel = factory.createOne(Hotel)
export const getAllHotels = factory.getAll(Hotel)
export const getHotel = factory.getOne(Hotel, { path: 'reviews createdBy' })
export const updateHotel = factory.updateOne(Hotel)
export const deleteHotel = factory.deleteOne(Hotel)

// ✅ Get hotel reviews
export const getHotelReviews = catchAsync(async (req, res, next) => {
  const hotel = await Hotel.findById(req.params.id).populate({
    path: 'reviews',
    populate: { path: 'createdBy', select: 'name email' },
  })

  if (!hotel) {
    return next(new AppError('No hotel found with that ID', 404))
  }

  res.status(200).json({
    status: 'success',
    results: hotel.reviews.length,
    data: { reviews: hotel.reviews },
  })
})
