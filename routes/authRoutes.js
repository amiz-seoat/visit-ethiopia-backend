import express from 'express'
import {
  signup,
  login,
  verifyEmail,
  protect,
  restrict,
  logOut,
  forgotPassword,
  resetPassword,
  updatePassword,
} from '../controllers/authController.js'
import {
  getMyProfile,
  updateMyProfile,
  deleteMyProfile,
  getUser,
} from '../controllers/userController.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.get('/verify/:token', verifyEmail)
router.post('/logout', logOut)

router.post('/forgotPassword', forgotPassword)
router.patch('/resetPassword/:token', resetPassword)

router.use(protect)

router.patch('/updatePassword', updatePassword)

// ✅ Test route (protected)
router.get('/test', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'You are authenticated and can access this route.',
  })
})

router
  .route('/profile')
  .get(getMyProfile, getUser)
  .patch(updateMyProfile)
  .delete(deleteMyProfile)

router.use(restrict('admin'))

router.route('/:id').get(getUser)

export default router
