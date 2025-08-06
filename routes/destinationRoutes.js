import express from 'express'

import { test } from '../controllers/destinationController.js'

const router = express.Router()

router.get('/destination', test)

export default router
