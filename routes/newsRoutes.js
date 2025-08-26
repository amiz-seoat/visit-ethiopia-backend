import express from 'express'
import { 
  test, 
  getAllNews, 
  featuredNews, 
  createNews, 
  getNews 
} from '../controllers/newsController.js'

import { protect, restrict } from '../controllers/authController.js'

const router = express.Router()

router.get('/test', test)

// Public routes
router.get('/', getAllNews)
router.get('/featured', featuredNews)
router.get('/:id', getNews)

// Admin only
router.post('/', protect, restrict('admin'), createNews)

export default router
