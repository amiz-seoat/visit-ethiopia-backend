import express from 'express'

import { test } from '../controllers/contactController.js'

const router = express.Router()

router.get('/contact', test)

export default router
