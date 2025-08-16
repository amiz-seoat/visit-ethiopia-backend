import express from 'express'

import {
  test,
  createTour,
  getAllTours,
  getTour,
  featuredTours,
  getTourReviews,
} from '../controllers/tourController.js'

import { protect, restrict } from '../controllers/authController.js'

const router = express.Router()

// Test route
router.get('/tour', test)

// ✅ Create tour (protected & restricted)
router.post('/', protect, restrict('admin'), createTour)

// ✅ Get all tours
router.get('/', getAllTours)

// ✅ Featured tours
router.get('/featured', featuredTours, getAllTours)

// ✅ Get single tour with reviews populated
router.get('/:id', getTour)

// ✅ Get reviews for a specific tour
router.get('/:id/reviews', getTourReviews)

export default router
