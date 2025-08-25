import News from '../models/News.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import factory from './handlerFactory.js'

export const test = catchAsync(async (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'test file',
  })
})

export const featuredNews = catchAsync(async (req, res, next) => {
  const news = await News.find({ isFeatured: true }).limit(5)
  if (!news) {
    return next(new AppError('No featured news found', 404))
  }
  res.status(200).json({
    status: 'success',
    results: news.length,
    data: news,
  })
})

export const getAllNews = factory.getAll(News)
