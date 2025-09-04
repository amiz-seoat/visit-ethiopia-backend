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

// 👉 Submit new contact form
export const createContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.create(req.body)

  res.status(201).json({
    status: 'success',
    data: contact,
  })
})

// List all inquiries (admin only)
export const getAllContacts = factory.getAll(Contact)
// Get a single inquiry (admin only)
export const getContact = factory.getOne(Contact)

// Update inquiry status (admin only)
export const updateContactStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const { status, response } = req.body

  if (!status) {
    return next(new AppError('Status is required', 400))
  }

  const allowedStatuses = ['new', 'in_progress', 'resolved', 'spam']
  if (!allowedStatuses.includes(status)) {
    return next(new AppError('Invalid status value', 400))
  }

  const update = {
    status,
    updatedAt: Date.now(),
  }

  if (typeof response === 'string') {
    update.response = response
  }

  // If status moved out of 'new', set responder metadata
  if (status !== 'new') {
    update.respondedBy = req.user?._id
    update.respondedAt = Date.now()
  }

  const contact = await Contact.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  })

  if (!contact) {
    return next(new AppError('No contact found with that ID', 404))
  }

  res.status(200).json({
    status: 'success',
    data: contact,
  })
})
