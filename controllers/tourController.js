import Tour from '../models/Tour.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import factory from './handlerFactory.js'
export const test = catchAsync(async (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'test file',
  })
})

export const getAllTours = factory.getAll(Tour)

export const getTour = factory.getOne(Tour, { path: 'reviews' })
