import express from 'express'

import { test } from '../controllers/restaurantController.js'

const router = express.Router()

router.get('/restaurant', test)

export default router
