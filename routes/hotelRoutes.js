import express from 'express'

import {
  test,
  getAllHotels,
  getHotel,
  updateHotel,
  deleteHotel,
  featuredHotels,
} from '../controllers/hotelController.js'
import { protect, restrict } from '../controllers/authController.js'

const router = express.Router()

router.get('/hotel', test)

router.get('/', getAllHotels)
router.get('/featured', featuredHotels, getAllHotels)
router.get('/:id', getHotel)
router.patch('/:id', protect, restrict('admin'), updateHotel)
router.delete('/:id', protect, restrict('admin'), deleteHotel)

export default router
