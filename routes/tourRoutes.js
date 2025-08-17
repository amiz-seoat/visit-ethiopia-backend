import express from 'express'

import {
  test,
  createTour,
  getAllTours,
  getTour,
  featuredTours,
  getTourReviews,
  updateTour,
  deleteTour,
} from '../controllers/tourController.js'

const router = express.Router()

// Test route
router.get('/tour', test)

// ✅ Create tour
router.post('/', createTour)

// ✅ Update a tour
router.patch('/:id', updateTour)
// ✅ Delete a tour
router.delete('/:id', deleteTour)

// ✅ Get all tours
router.get('/', getAllTours)

// ✅ Featured tours
router.get('/featured', featuredTours, getAllTours)

// ✅ Get single tour with reviews populated
router.get('/:id', getTour)

// ✅ Get reviews for a specific tour
router.get('/:id/reviews', getTourReviews)

export default router
