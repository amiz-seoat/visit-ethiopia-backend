import express from 'express'
import {
  test,
  getPendingReviews,
  approveReview,
  createReview,
  getMyReviews,
} from '../controllers/reviewController.js'
import { protect, restrict } from '../controllers/authController.js'

const router = express.Router()

// Test route
router.get('/review', test)

// User routes
router.post('/', protect, createReview)        // ✅ create review
router.get('/me', protect, getMyReviews)       // ✅ get my reviews

// Admin routes
router.get('/pending', protect, restrict('admin'), getPendingReviews)
router.patch('/:id/approve', protect, restrict('admin'), approveReview)

export default router
