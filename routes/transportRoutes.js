import express from 'express'

import { test } from '../controllers/transportController.js'

const router = express.Router()

router.get('/transport', test)

export default router
