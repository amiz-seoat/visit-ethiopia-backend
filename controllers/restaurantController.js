import Restaurant from '../models/Restaurants.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import factory from './handlerFactory.js'

export const test = catchAsync(async (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'test file',
  })
})

//filter for featured restaurants
export const featuredRestaurants = (req, res, next) => {
  req.query.isFeatured = 'true'
  req.query.sort = '-averageRating,price'
  next()
}

export const getAllRestaurants = factory.getAll(Restaurant)
export const getRestaurant = factory.getOne(Restaurant, {
  path: 'reviews createdBy',
})
export const updateRestaurant = factory.updateOne(Restaurant)
export const deleteRestaurant = factory.deleteOne(Restaurant)
