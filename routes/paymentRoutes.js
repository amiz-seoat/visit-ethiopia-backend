import express from 'express'
import {
  initializePayment,
  verifyPayment,
} from '../controllers/paymentController.js'

const router = express.Router()

// Initialize payment
router.post('/pay', initializePayment)

// Verify payment
router.get('/verify/:tx_ref', verifyPayment)

export default router
