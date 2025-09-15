import Hotel from '../models/Hotel.js'
import Review from '../models/Review.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import factory from './handlerFactory.js'
import cloudinary from '../config/cloudinary.js'

// ✅ Test endpoint
export const test = catchAsync(async (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'test file',
  })
})

// ✅ Featured hotels middleware
export const featuredHotels = (req, res, next) => {
  req.query.isFeatured = 'true'
  req.query.sort = '-rating,price'
  next()
}

// ✅ Create hotel (admin only)
export const createHotel = catchAsync(async (req, res, next) => {
  req.body.createdBy = req.user._id

  if (req.file) {
    const uploadRes = await cloudinary.uploader.upload(req.file.path, {
      folder: 'hotels',
    })
    req.body.image = uploadRes.secure_url
  }

  const hotel = await Hotel.create(req.body)
  res.status(201).json({ status: 'success', data: hotel })
})

// ✅ Get all hotels
export const getAllHotels = factory.getAll(
  Hotel,
  {},
  { path: 'reviews createdBy' }
)

// ✅ Get single hotel with reviews + createdBy
export const getHotel = factory.getOne(Hotel, { path: 'reviews createdBy' })

// ✅ Update hotel (admin only)
export const updateHotel = catchAsync(async (req, res, next) => {
  let updateData = { ...req.body }

  // If a new image is uploaded
  if (req.file) {
    const uploadRes = await cloudinary.uploader.upload(req.file.path, {
      folder: 'hotels',
    })
    updateData.image = uploadRes.secure_url
  }

  const hotel = await Hotel.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  })

  if (!hotel) {
    return next(new AppError('No hotel found with that ID', 404))
  }

  res.status(200).json({
    status: 'success',
    data: hotel,
  })
})

// ✅ Delete hotel (admin only)
export const deleteHotel = factory.deleteOne(Hotel)

// ✅ Get hotel reviews
export const getHotelReviews = catchAsync(async (req, res, next) => {
  const hotel = await Hotel.findById(req.params.id).populate({
    path: 'reviews',
    populate: { path: 'createdBy', select: 'FirstName LastName email' },
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
