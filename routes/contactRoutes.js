import express from 'express'

import {
  test,
  getAllContacts,
  getContact,
} from '../controllers/contactController.js'
import { protect, restrict } from '../controllers/authController.js'

const router = express.Router()

router.get('/contact', test)

router.route('/').get(protect, restrict('admin'), getAllContacts)
router.route('/:id').get(protect, restrict('admin'), getContact)

export default router
