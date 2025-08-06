import express from 'express'
import {
  getMyProfile,
  updateMyProfile,
  deleteMyProfile,
  getAllUsers,
  createUser,
  getUser,
  deleteUser,
} from '../controllers/userController.js'
import { protect, restrict } from '../controllers/authController.js'

const router = express.Router()

router.use(protect)

router
  .route('/profile')
  .get(getMyProfile, getUser)
  .patch(updateMyProfile)
  .delete(deleteMyProfile)

router.use(restrict('admin'))

router.route('/').get(getAllUsers).post(createUser)
router.route('/:id').get(getUser).delete(deleteUser)

export default router
