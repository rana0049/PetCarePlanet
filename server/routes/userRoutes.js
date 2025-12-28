const express = require('express');
const { getVets, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/vets', getVets);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
