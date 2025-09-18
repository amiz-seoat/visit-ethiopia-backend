import Transport from '../models/Transport.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import factory from './handlerFactory.js'
import APIFeatures from '../utils/apiFeatures.js'
import cloudinary from '../config/cloudinary.js'

// Test
export const test = catchAsync(async (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'test file',
  })
})

// Existing
export const getAllTransports = factory.getAll(Transport, {}, [
  'reviews',
  'createdBy',
])
export const getTransport = factory.getOne(Transport, ['reviews', 'createdBy'])

// Create transport (Admin only)
export const createTransport = catchAsync(async (req, res, next) => {
  req.body.createdBy = req.user._id // attach logged-in admin as creator
  if (req.file) {
    const uploadRes = await cloudinary.uploader.upload(req.file.path, {
      folder: 'transports',
    })
    req.body.imageUrl = uploadRes.secure_url
  }
  const transport = await Transport.create(req.body)

  res.status(201).json({ status: 'success', data: transport })
})

// ✅ Get reviews for a specific transport (using the reviews array from transport model)
export const getTransportReviews = catchAsync(async (req, res, next) => {
  const transport = await Transport.findById(req.params.id).populate('reviews')
  if (!transport) {
    return next(new AppError('No transport found with that ID', 404))
  }
  res.status(200).json({
    status: 'success',
    results: transport.reviews.length,
    data: { reviews: transport.reviews },
  })
})

// Update transport (Admin only)
export const updateTransport = catchAsync(async (req, res, next) => {
  let updateData = { ...req.body }
  // If a new image is uploaded
  if (req.file) {
    const uploadRes = await cloudinary.uploader.upload(req.file.path, {
      folder: 'transports',
    })
    updateData.imageUrl = uploadRes.secure_url
  }
  const transport = await Transport.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  )
  if (!transport) {
    return next(new AppError('No transport found with that ID', 404))
  }
  res.status(200).json({ status: 'success', data: transport })
})
// Delete transport (Admin only)
export const deleteTransport = factory.deleteOne(Transport)
