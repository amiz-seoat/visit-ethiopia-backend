import express from 'express'

import {
  test,
  getAllTransports,
  getTransport,
  getAllRoutes,
} from '../controllers/transportController.js'

const router = express.Router()

router.get('/transport', test)
router.get('/', getAllTransports)
router.get('/routes', getAllRoutes)
router.get('/:id', getTransport)

export default router
