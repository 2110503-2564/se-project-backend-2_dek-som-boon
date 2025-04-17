const express = require('express');
const { getUsers, getUser,createUser, updateUser, deleteUser } = require('../controllers/users');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Only admins can access user management routes
router.route('/').get(protect, authorize('admin'), getUsers).post(protect, authorize('admin'), createUser);
router.route('/:id').get(protect, authorize('admin'), getUser).put(protect, authorize('admin', 'user'), updateUser).delete(protect, authorize('admin'), deleteUser);

module.exports = router;
