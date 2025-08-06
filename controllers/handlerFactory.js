const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const APIFeatures = require('./../utils/apiFeatures')

export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id)
    if (!doc) {
      return next(new AppError('No document found with that ID', 404))
    }
    res.status(204).json({
      status: 'success',
      data: null,
    })
  })

export const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return the updated document
      runValidators: true, // validate the data against the schema
    })
    if (!doc) {
      return next(new AppError('No document found with that ID', 404))
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    })
  })

export const createOne = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.create(req.body)
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    })
  })

export const getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id)
    if (popOptions) query = query.populate(popOptions)
    const doc = await query
    if (!doc) {
      return next(new AppError('No document found with that ID', 404))
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    })
  })

export const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow nested GET reviews on tours
    let filter
    if (req.params.tourId) filter = { tour: req.params.tourId }
    //EXCUTE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate()
    const doc = await features.query
    res.status(200).json({
      status: 'success',
      result: doc.length,
      data: {
        data: doc,
      },
    })
  })
