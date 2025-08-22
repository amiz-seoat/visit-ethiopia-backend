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
  select: '-__v -createdAt -updatedAt',
})

export const getAllRoutes = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Transport.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()

  const transports = await features.query

  const flattenedRoutes = transports.flatMap((transport) =>
    transport.routes.map((route) => ({
      transportId: transport._id,
      transportName: transport.name,
      type: transport.type,
      vehicleDetails: transport.vehicleDetails,
      contact: transport.contact,
      ...route.toObject(), // spread route fields
    }))
  )

  res.status(200).json({
    status: 'success',
    results: flattenedRoutes.length,
    data: flattenedRoutes,
  })
})
