const express = require('express');
const { getListings, createListing, getListingById, updateListingStatus } = require('../controllers/listingController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(getListings).post(protect, createListing);
router.route('/:id').get(getListingById);
router.route('/:id/status').put(protect, admin, updateListingStatus);

module.exports = router;
