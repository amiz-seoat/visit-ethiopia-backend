import express from 'express'
import { protect, restrict } from '../controllers/authController.js'

import {
  test,
  getAllRestaurants,
  getRestaurant,
  featuredRestaurants,
  updateRestaurant,
  deleteRestaurant,
} from '../controllers/restaurantController.js'

const router = express.Router()

router.get('/restaurant', test)

router.get('/', getAllRestaurants)
router.get('/featured', featuredRestaurants, getAllRestaurants)
router.get('/:id', getRestaurant)
router.patch('/:id', protect, restrict('admin'), updateRestaurant)
router.delete('/:id', protect, restrict('admin'), deleteRestaurant)

export default router
