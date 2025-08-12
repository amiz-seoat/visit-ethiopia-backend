import express from 'express'

import { test } from '../controllers/tourController.js'
import { getAllTours } from '../controllers/tourController.js'

const router = express.Router()

router.get('/tour', test)
router.get('/', getAllTours)

export default router
