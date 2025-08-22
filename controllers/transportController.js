import Transport from '../models/Transport.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import factory from './handlerFactory.js'

export const test = catchAsync(async (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'test file',
  })
})

export const featuredTransports = (req, res, next) => {
  req.query.isFeatured = 'true'
  req.query.sort = '-averageRating,routes.price'
  next()
}

export const getAllTransports = factory.getAll(Transport)
export const getTransport = factory.getOne(Transport, {
  path: 'reviews createdBy',
})
