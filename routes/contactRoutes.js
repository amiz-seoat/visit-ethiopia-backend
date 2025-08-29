import express from 'express'

import {
  test,
  getAllContacts,
  getContact,
} from '../controllers/contactController.js'
import { protect, restrictTo } from '../controllers/authController.js'

const router = express.Router()

router.get('/contact', test)

router.route('/').get(protect, restrictTo('admin'), getAllContacts)
router.route('/:id').get(protect, restrictTo('admin'), getContact)

export default router
