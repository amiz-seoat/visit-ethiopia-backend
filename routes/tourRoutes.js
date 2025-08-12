import express from 'express'

import { test, getAllTours } from '../controllers/tourController.js'

const router = express.Router()

router.get('/tour', test)
router.get('/', getAllTours)

export default router
