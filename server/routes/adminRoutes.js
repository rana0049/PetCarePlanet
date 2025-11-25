const express = require('express');
const {
    getAdminStats,
    getAllVets,
    approveVet,
    rejectVet,
    getAllUsers,
    banUser,
    activateUser
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require admin authentication
router.use(protect, admin);

// Admin statistics
router.get('/stats', getAdminStats);

// Vet management
router.get('/vets', getAllVets);
router.put('/vets/:id/approve', approveVet);
router.put('/vets/:id/reject', rejectVet);

// User management
router.get('/users', getAllUsers);
router.put('/users/:id/ban', banUser);
router.put('/users/:id/activate', activateUser);

module.exports = router;
