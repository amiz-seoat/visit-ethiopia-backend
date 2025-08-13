import express from 'express'

import {
  test,
  getAllTours,
  getTour,
  featuredTours,
} from '../controllers/tourController.js'

const router = express.Router()

router.get('/tour', test)
router.get('/', getAllTours)
router.get('/:id', getTour)
router.get('/featured', featuredTours, getAllTours)

export default router
