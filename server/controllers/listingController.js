const Listing = require('../models/Listing');

// @desc    Get all approved listings
// @route   GET /api/market
// @access  Public
const getListings = async (req, res) => {
    const { keyword, category, location } = req.query;

    let query = { status: 'approved' };

    if (keyword) {
        query.title = { $regex: keyword, $options: 'i' };
    }
    if (category) {
        query.category = category;
    }
    if (location) {
        query.location = location;
    }

    try {
        const listings = await Listing.find(query).populate('seller', 'name email');
        res.json(listings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new listing
// @route   POST /api/market
// @access  Private
const createListing = async (req, res) => {
    const { title, description, price, category, breed, age, image, location } = req.body;

    try {
        const listing = new Listing({
            seller: req.user._id,
            title,
            description,
            price,
            category,
            breed,
            age,
            image,
            location,
        });

        const createdListing = await listing.save();
        res.status(201).json(createdListing);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get listing by ID
// @route   GET /api/market/:id
// @access  Public
const getListingById = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id).populate('seller', 'name email');

        if (listing) {
            res.json(listing);
        } else {
            res.status(404).json({ message: 'Listing not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve/Reject listing (Admin)
// @route   PUT /api/market/:id/status
// @access  Private/Admin
const updateListingStatus = async (req, res) => {
    const { status } = req.body; // approved, rejected

    try {
        const listing = await Listing.findById(req.params.id);

        if (listing) {
            listing.status = status;
            const updatedListing = await listing.save();
            res.json(updatedListing);
        } else {
            res.status(404).json({ message: 'Listing not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getListings, createListing, getListingById, updateListingStatus };
