import Contact from '../models/Contact.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import factory from './handlerFactory.js'

export const test = catchAsync(async (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'test file',
  })
})

// List All inquiries
export const getAllContacts = factory.getAll(Contact)
// Get a single inquiry
export const getContact = factory.getOne(Contact)
