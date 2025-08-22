import Transport from '../models/Transport.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import factory from './handlerFactory.js'
import APIFeatures from '../utils/apiFeatures.js'

export const test = catchAsync(async (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'test file',
  })
})

export const getAllTransports = factory.getAll(Transport)
export const getTransport = factory.getOne(Transport, {
  path: 'reviews createdBy',
  select: '-__v updatedAt ',
})

export const getAllRoutes = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Transport.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()

  const routes = await features.query

  res.status(200).json({
    status: 'success',
    results: routes.length,
    data: routes,
  })
})
