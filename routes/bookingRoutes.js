import express from 'express'

import { test } from '../controllers/bookingController.js'

const router = express.Router()

router.get('/booking', test)

export default router
