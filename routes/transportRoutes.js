import express from 'express'
import {
  test,
  getAllTransports,
  getTransport,
  getAllRoutes,
  createTransport,
  getTransportReviews,
} from '../controllers/transportController.js'
import { protect, restrict } from '../controllers/authController.js'

const router = express.Router()

router.get('/transport', test)

router
  .route('/')
  .get(getAllTransports)
  .post(protect, restrict('admin'), createTransport) // ✅ only admin can create

router.get('/routes', getAllRoutes)
router.get('/:id', getTransport)
router.get('/:id/reviews', getTransportReviews) // ✅ new route

export default router
