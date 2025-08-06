import express from 'express'

import { test } from '../controllers/reviewController.js'

const router = express.Router()

router.get('/review', test)

export default router
