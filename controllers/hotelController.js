import Hotel from '../models/Hotel.js'
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

export const getAllHotels = factory.getAll(Hotel)
export const getHotel = factory.getOne(Hotel, { path: 'reviews createdBy' })

export const updateHotel = factory.updateOne(Hotel)
export const deleteHotel = factory.deleteOne(Hotel)
