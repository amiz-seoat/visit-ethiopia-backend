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

export const getAllTransports = factory.getAll(Transport)
export const getTransport = factory.getOne(Transport, {
  path: 'reviews createdBy',
  select: '-__v updatedAt ',
})

import Transport from '../models/transportModel.js'

export const getAllRoutes = catchAsync(async (req, res, next) => {
  const queryObj = { ...req.query }

  // Fields to exclude from normal filtering
  const excludedFields = [
    'sort',
    'limit',
    'page',
    'fields',
    'minPrice',
    'maxPrice',
  ]
  excludedFields.forEach((field) => delete queryObj[field])

  // Build match conditions dynamically
  const matchConditions = {}

  // ✅ Support dynamic filtering for top-level fields like type, status, averageRating
  Object.keys(queryObj).forEach((key) => {
    matchConditions[key] = { $regex: queryObj[key], $options: 'i' }
  })

  // ✅ Handle price filtering separately
  if (req.query.minPrice || req.query.maxPrice) {
    matchConditions['routes.price'] = {}
    if (req.query.minPrice)
      matchConditions['routes.price'].$gte = parseFloat(req.query.minPrice)
    if (req.query.maxPrice)
      matchConditions['routes.price'].$lte = parseFloat(req.query.maxPrice)
  }

  // ✅ Sorting logic
  let sortField = 'routes.price'
  let sortOrder = 1
  if (req.query.sort) {
    if (req.query.sort.startsWith('-')) {
      sortField = req.query.sort.slice(1)
      sortOrder = -1
    } else {
      sortField = req.query.sort
    }
  }

  // ✅ Aggregate pipeline for routes
  const routes = await Transport.aggregate([
    { $unwind: '$routes' },
    { $match: matchConditions },
    {
      $project: {
        _id: 1,
        name: 1,
        type: 1,
        description: 1,
        'vehicleDetails.model': 1,
        'vehicleDetails.capacity': 1,
        'vehicleDetails.features': 1,
        'vehicleDetails.images': 1,
        routes: 1,
        contact: 1,
        averageRating: 1,
        status: 1,
      },
    },
    { $sort: { [sortField]: sortOrder } }, // Dynamic sorting
  ])

  res.status(200).json({
    status: 'success',
    length: routes.length,
    data: routes,
  })
})
