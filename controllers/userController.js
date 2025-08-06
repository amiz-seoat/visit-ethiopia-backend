import User from '../models/User.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import factory from './handlerFactory.js'

const fillterObj = (obj, allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })
  return newObj
}

export const getMyProfile = (req, res, next) => {
  // 1) Get user from collection
  req.params.id = req.user.id
  next()
}

export const updateMyProfile = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updatePassword.',
        400
      )
    )
  }
  // 2) Filter out unwanted fields names that are not allowed to be updated
  const filteredBody = fillterObj(req.body, ['FirstName', 'LastName', 'email'])
  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  })
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  })
})

export const deleteMyProfile = catchAsync(async (req, res, next) => {
  // 1) Find user and set active to false
  await User.findByIdAndUpdate(req.user.id, { active: false })

  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  })

  res.status(204).json({
    status: 'success',
    data: null,
  })
})

export const getUser = factory.getOne(User)
