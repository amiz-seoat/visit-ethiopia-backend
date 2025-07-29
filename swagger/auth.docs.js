/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication & authorization
 */

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: abyalew lobe
 *               email:
 *                 type: string
 *                 example: abyalew@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               confirmPassword:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 example: user
 *     responses:
 *       201:
 *         description: User created successfully (returns JWT)
 *       400:
 *         description: Invalid data or user already exists
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login with email & password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: abyalew@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Logged in successfully (returns JWT)
 *       401:
 *         description: Invalid email or password
 */

/**
 * @swagger
 * /users/verify/{token}:
 *   get:
 *     summary: Verify user email
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Email verification token sent via email
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 */

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Logout user (invalidate cookie)
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */

/**
 * @swagger
 * /users/forgotPassword:
 *   post:
 *     summary: Send password reset email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: abyalew@example.com
 *     responses:
 *       200:
 *         description: Reset email sent
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /users/resetPassword/{token}:
 *   patch:
 *     summary: Reset user password using token
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Password reset token
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: newPassword123
 *               confirmPassword:
 *                 type: string
 *                 example: newPassword123
 *     responses:
 *       200:
 *         description: Password updated successfully (returns JWT)
 *       400:
 *         description: Invalid or expired token
 */

/**
 * @swagger
 * /users/test:
 *   get:
 *     summary: Test protected route (JWT required)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Access granted
 *       401:
 *         description: Unauthorized (no or invalid token)
 */

/**
 * @swagger
 * /users/updatePassword:
 *   patch:
 *     summary: Change password for a logged-in user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - newPasswordConfirm
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: oldPassword123
 *               newPassword:
 *                 type: string
 *                 example: newPassword123
 *               newPasswordConfirm:
 *                 type: string
 *                 example: newPassword123
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Bad Request (validation error)
 *       401:
 *         description: Unauthorized or incorrect current password
 */

