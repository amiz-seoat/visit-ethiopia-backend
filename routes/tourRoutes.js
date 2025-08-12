import express from 'express'

import { test, getAllTours, getTour } from '../controllers/tourController.js'

const router = express.Router()

router.get('/tour', test)
router.get('/', getAllTours)
router.get('/:id', getTour)

export default router
