const express = require('express');
const { getListings, createListing, getListingById, updateListingStatus, getAdminListings, deleteListing, updateListing, getMyListings, promoteListing } = require('../controllers/listingController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(getListings).post(protect, createListing);
router.route('/mylistings').get(protect, getMyListings);
router.route('/admin/all').get(protect, admin, getAdminListings);
router.route('/:id').get(getListingById).delete(protect, deleteListing).put(protect, updateListing);
router.route('/:id/status').put(protect, admin, updateListingStatus);
router.route('/:id/feature').put(protect, admin, promoteListing);

module.exports = router;
