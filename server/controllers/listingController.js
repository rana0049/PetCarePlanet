const Listing = require('../models/Listing');

// @desc    Get all approved listings
// @route   GET /api/market
// @access  Public
// @desc    Get all approved listings
// @route   GET /api/market
// @access  Public
const getListings = async (req, res) => {
    const { keyword, category, location, minPrice, maxPrice, gender, isVaccinated, isTrained, isPedigree, isFeatured } = req.query;
    console.log('DEBUG: getListings called');
    console.log('DEBUG: req.query:', req.query);
    console.log('DEBUG: MONGO_URI:', process.env.MONGO_URI);

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
    if (isFeatured === 'true') {
        query.isFeatured = true;
        query.featuredExpiresAt = { $gt: new Date() };
    }

    try {
        console.log('DEBUG: Final Query:', JSON.stringify(query));
        const listings = await Listing.find(query).populate('seller', 'name email phone').sort({ createdAt: -1 });

        // Runtime check to un-feature expired listings in the response (optional but good for consistency)
        // Note: This doesn't update the DB, just the response. 
        // Ideally we'd have a cron job, but this works for now.
        // Runtime check to un-feature expired listings in the response
        const processedListings = listings.map(listing => {
            const now = new Date();
            // Strict check: Must have an expiration date AND it must be in the future
            const hasValidFeature = listing.isFeatured &&
                listing.featuredExpiresAt &&
                new Date(listing.featuredExpiresAt) > now;

            if (!hasValidFeature) {
                // If not valid, force false in response
                if (listing.isFeatured) {
                    const doc = listing.toObject ? listing.toObject() : listing;
                    doc.isFeatured = false;
                    return doc;
                }
            }
            return listing;
        });

        console.log(`DEBUG: Found ${listings.length} listings`);
        res.json(processedListings);
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
        console.log('DEBUG: createListing body:', req.body);
        const images = image ? [image] : (req.body.images || []);

        if (images.length === 0) {
            return res.status(400).json({ message: 'Please upload at least one image.' });
        }

        // Update user phone if provided and missing
        if (req.body.phone && !req.user.phone) {
            req.user.phone = req.body.phone;
            await req.user.save();
        }

        // Ensure user has a phone number
        if (!req.user.phone) {
            return res.status(400).json({ message: 'Please provide a phone number so buyers can contact you.' });
        }

        const listing = new Listing({
            seller: req.user._id,
            title,
            description,
            price,
            category,
            breed,
            age,
            images,
            location,
            gender,
            isVaccinated,
            isTrained,
            isPedigree
        });

        const createdListing = await listing.save();
        res.status(201).json(createdListing);
    } catch (error) {
        console.error('DEBUG: createListing error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get listing by ID
// @route   GET /api/market/:id
// @access  Public
const getListingById = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id).populate('seller', 'name email phone');

        if (listing) {
            // Runtime check for expiration
            let listingData = listing.toObject();
            const now = new Date();
            const hasValidFeature = listingData.isFeatured &&
                listingData.featuredExpiresAt &&
                new Date(listingData.featuredExpiresAt) > now;

            if (!hasValidFeature) {
                listingData.isFeatured = false;
            }
            res.json(listingData);
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
            .populate('seller', 'name email phone')
            .sort({ status: 1, createdAt: -1 }); // Pending first, then newest
        res.json(listings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a listing
// @route   DELETE /api/market/:id
// @access  Private
const deleteListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        // Check ownership or admin
        if (listing.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to delete this listing' });
        }

        await listing.deleteOne();
        res.json({ message: 'Listing removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user's listings
// @route   GET /api/market/mylistings
// @access  Private
const getMyListings = async (req, res) => {
    try {
        const listings = await Listing.find({ seller: req.user._id }).sort({ createdAt: -1 });
        res.json(listings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a listing
// @route   PUT /api/market/:id
// @access  Private
const updateListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        // Check ownership or admin
        if (listing.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to edit this listing' });
        }

        // Allowed fields to update
        const { title, description, price, category, breed, age, images, location, gender, isVaccinated, isTrained, isPedigree } = req.body;

        listing.title = title || listing.title;
        listing.description = description || listing.description;
        listing.price = price || listing.price;
        listing.category = category || listing.category;
        listing.breed = breed || listing.breed;
        listing.age = age || listing.age;
        listing.images = images || listing.images;
        listing.location = location || listing.location;
        listing.gender = gender || listing.gender;
        listing.isVaccinated = isVaccinated !== undefined ? isVaccinated : listing.isVaccinated;
        listing.isTrained = isTrained !== undefined ? isTrained : listing.isTrained;
        listing.isPedigree = isPedigree !== undefined ? isPedigree : listing.isPedigree;

        // Note: explicitly NOT updating 'status' or 'isFeatured' here to prevent privilege escalation
        // Unless admin wants to? The requirement said "allow user to edit". 
        // Admin usually uses a separate route for status, but updating content should reset status if critical? 
        // For now, let's keep status as is. If user edits, maybe it should go back to 'pending'? 
        // Let's stick to safe update.

        const updatedListing = await listing.save();
        res.json(updatedListing);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Promote a listing (Admin)
// @route   PUT /api/market/:id/feature
// @access  Private/Admin
const promoteListing = async (req, res) => {
    const { duration } = req.body; // 'weekly' or 'monthly'

    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        const now = new Date();

        if (duration === 'remove') {
            listing.isFeatured = false;
            listing.featuredExpiresAt = null;
        } else {
            const expiresAt = new Date(now);
            if (duration === 'monthly') {
                expiresAt.setDate(expiresAt.getDate() + 30);
            } else {
                // Default to weekly
                expiresAt.setDate(expiresAt.getDate() + 7);
            }
            console.log(`DEBUG: Promoting listing ${listing._id} to ${duration}. Expires: ${expiresAt}`);
            listing.isFeatured = true;
            listing.featuredExpiresAt = expiresAt;
        }

        const updatedListing = await listing.save();
        res.json(updatedListing);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getListings, createListing, getListingById, updateListingStatus, getAdminListings, deleteListing, updateListing, getMyListings, promoteListing };
