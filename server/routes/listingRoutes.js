const express = require('express');
const { getListings, createListing, getListingById, updateListingStatus, getAdminListings } = require('../controllers/listingController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(getListings).post(protect, createListing);
router.route('/admin/all').get(protect, admin, getAdminListings);
router.route('/:id').get(getListingById);
router.route('/:id/status').put(protect, admin, updateListingStatus);

module.exports = router;
