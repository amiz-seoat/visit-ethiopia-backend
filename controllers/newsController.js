import News from '../models/News.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import factory from './handlerFactory.js'
import cloudinary from '../config/cloudinary.js'

export const test = catchAsync(async (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'test file',
  })
})

export const featuredNews = catchAsync(async (req, res, next) => {
  const news = await News.find({ isFeatured: true }).limit(5)
  if (!news || news.length === 0) {
    return next(new AppError('No featured news found', 404))
  }
  res.status(200).json({
    status: 'success',
    results: news.length,
    data: news,
  })
})

export const getAllNews = factory.getAll(News)

export const getNews = factory.getOne(News)

// ✅ Create news (Admin only)
export const createNews = catchAsync(async (req, res, next) => {
  req.body.author = req.user._id // attach logged-in admin as author
  if (req.file) {
    const uploadRes = await cloudinary.uploader.upload(req.file.path, {
      folder: 'news',
    })
    req.body.image = uploadRes.secure_url
  }
  const news = await News.create(req.body)

  res.status(201).json({ status: 'success', data: news })
})

// ✅ Update news (Admin only)
export const updateNews = catchAsync(async (req, res, next) => {
  let updateData = { ...req.body }
  // If a new image is uploaded
  if (req.file) {
    const uploadRes = await cloudinary.uploader.upload(req.file.path, {
      folder: 'news',
    })
    updateData.image = uploadRes.secure_url
  }
  const news = await News.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  })
  if (!news) {
    return next(new AppError('No news found with that ID', 404))
  }
  res.status(200).json({ status: 'success', data: news })
})

// ✅ Delete news (Admin only)
export const deleteNews = factory.deleteOne(News)
