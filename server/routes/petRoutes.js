const express = require('express');
const { getPets, createPet, getPetById, updatePetHealth, deletePet } = require('../controllers/petController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getPets).post(protect, createPet);
router.route('/:id').get(protect, getPetById).delete(protect, deletePet);
router.route('/:id/health').put(protect, updatePetHealth);

module.exports = router;
