import express from 'express'

import {
  test,
  getAllDestinations,
  getDestination,
} from '../controllers/destinationController.js'

const router = express.Router()

router.get('/destination', test)
router.get('/', getAllDestinations)
router.get('/:id', getDestination)

export default router
