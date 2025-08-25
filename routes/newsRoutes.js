import express from 'express'

import { test, getAllNews } from '../controllers/newsControllre.js'

import { protect, restrict } from '../controllers/authController.js'

const router = express.Router()

router.get('/test', test)

router.get('/', getAllNews)
router.get('/featured', getAllNews)

export default router
