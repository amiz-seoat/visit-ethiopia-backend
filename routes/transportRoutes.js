import express from 'express'

import {
  test,
  getAllTransports,
  getTransport,
  featuredTransports,
} from '../controllers/transportController.js'

const router = express.Router()

router.get('/transport', test)
router.get('/', getAllTransports)
router.get('/featured', featuredTransports, getAllTransports)
router.get('/:id', getTransport)

export default router
