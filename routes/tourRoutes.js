import express from 'express'

import { test } from '../controllers/tourController.js'

const router = express.Router()

router.get('/tour', test)

export default router
