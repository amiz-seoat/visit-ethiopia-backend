import express from 'express'

import {
  test,
  getPendingReviews,
  approveReview,
} from '../controllers/reviewController.js'
import { protect, restrict } from '../controllers/authController.js'

const router = express.Router()

router.get('/review', test)
router.get('/pending', protect, restrict('admin'), getPendingReviews)
router.patch('/:id/approve', protect, restrict('admin'), approveReview)

export default router
