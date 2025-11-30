const Listing = require('../models/Listing');

// @desc    Get all approved listings
// @route   GET /api/market
// @access  Public
// @desc    Get all approved listings
// @route   GET /api/market
// @access  Public
const getListings = async (req, res) => {
    const { keyword, category, location, minPrice, maxPrice, gender, isVaccinated, isTrained, isPedigree } = req.query;

    let query = { status: 'approved' };

    if (keyword) {
        query.$or = [
            { title: { $regex: keyword, $options: 'i' } },
            { breed: { $regex: keyword, $options: 'i' } }
        ];
    }
    if (category) {
        query.category = category;
    }
    if (location) {
        query.location = location;
    }
    if (gender) {
        query.gender = gender;
    }

    // Price Range Filter
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Boolean Filters
    if (isVaccinated === 'true') query.isVaccinated = true;
    if (isTrained === 'true') query.isTrained = true;
    if (isPedigree === 'true') query.isPedigree = true;

    try {
        const listings = await Listing.find(query).populate('seller', 'name email').sort({ createdAt: -1 });
        res.json(listings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new listing
// @route   POST /api/market
// @access  Private
const createListing = async (req, res) => {
    const { title, description, price, category, breed, age, image, location, gender, isVaccinated, isTrained, isPedigree } = req.body;

    try {
        const listing = new Listing({
            seller: req.user._id,
            title,
            description,
            price,
            category,
            breed,
            age,
            age,
            images: image ? [image] : (req.body.images || []), // Handle both single and multiple image inputs
            location,
            gender,
            isVaccinated,
            isTrained,
            isPedigree
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

// @desc    Get all listings (Admin)
// @route   GET /api/market/admin/all
// @access  Private/Admin
const getAdminListings = async (req, res) => {
    try {
        const listings = await Listing.find({})
            .populate('seller', 'name email')
            .sort({ status: 1, createdAt: -1 }); // Pending first, then newest
        res.json(listings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getListings, createListing, getListingById, updateListingStatus, getAdminListings };
