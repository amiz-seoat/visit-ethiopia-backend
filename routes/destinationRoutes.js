import express from 'express'

import {
  test,
  getAllDestinations,
  getDestination,
  createDestination,
  getToursForDestination,
  featuredDestinations,
} from '../controllers/destinationController.js'

import { protect, restrict } from '../controllers/authController.js'

const router = express.Router()

// Test route
router.get('/destination', test)

// ✅ Admin only: Create a new destination
router.post('/', protect, restrict('admin'), createDestination)

// ✅ Public: Get all destinations
router.get('/', getAllDestinations)

// ✅ Public: Get single destination by ID
router.get('/:id', getDestination)
// ✅ Public: Get featured destinations
router.get('/featured', featuredDestinations, getAllDestinations)

// ✅ Public: Get tours for a destination
router.get('/:id/tours', getToursForDestination)

export default router
