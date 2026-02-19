const User = require('../models/User');
const BlogPost = require('../models/BlogPost');
const Listing = require('../models/Listing');
const Appointment = require('../models/Appointment');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalPetOwners = await User.countDocuments({ role: 'pet_owner' });
        const totalVets = await User.countDocuments({ role: 'vet' });
        const totalAdmins = await User.countDocuments({ role: 'admin' });
        const pendingVets = await User.countDocuments({ role: 'vet', isApproved: false });

        const totalListings = await Listing.countDocuments();
        const activeListings = await Listing.countDocuments({ status: 'active' });
        const pendingListings = await Listing.countDocuments({ status: 'pending' });

        const totalAppointments = await Appointment.countDocuments();
        const totalBlogs = await BlogPost.countDocuments();

        res.json({
            users: {
                total: totalUsers,
                petOwners: totalPetOwners,
                vets: totalVets,
                admins: totalAdmins,
                pendingVets: pendingVets
            },
            listings: {
                total: totalListings,
                active: activeListings,
                pending: pendingListings
            },
            appointments: totalAppointments,
            blogs: totalBlogs
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all vets
// @route   GET /api/admin/vets
// @access  Private/Admin
const getAllVets = async (req, res) => {
    try {
        const vets = await User.find({ role: 'vet' })
            .select('-password')
            .sort({ createdAt: -1 });

        res.json(vets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve a vet
// @route   PUT /api/admin/vets/:id/approve
// @access  Private/Admin
const approveVet = async (req, res) => {
    try {
        const vet = await User.findById(req.params.id);

        if (!vet) {
            return res.status(404).json({ message: 'Vet not found' });
        }

        if (vet.role !== 'vet') {
            return res.status(400).json({ message: 'User is not a vet' });
        }

        vet.isApproved = true;
        await vet.save();

        res.json({ message: 'Vet approved successfully', vet });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reject a vet
// @route   PUT /api/admin/vets/:id/reject
// @access  Private/Admin
// @desc    Reject a vet
// @route   PUT /api/admin/vets/:id/reject
// @access  Private/Admin
const rejectVet = async (req, res) => {
    try {
        const vet = await User.findById(req.params.id);

        if (!vet) {
            return res.status(404).json({ message: 'Vet not found' });
        }

        if (vet.role !== 'vet') {
            return res.status(400).json({ message: 'User is not a vet' });
        }

        // If the vet is not yet approved (pending), we delete the application completely
        if (!vet.isApproved) {
            await User.findByIdAndDelete(req.params.id);
            return res.json({ message: 'Vet application rejected and removed', vetId: req.params.id });
        }

        // If the vet was already approved, we just revoke the approval status
        vet.isApproved = false;
        await vet.save();

        res.json({ message: 'Vet approval revoked', vet });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({})
            .select('-password')
            .sort({ createdAt: -1 });

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Ban a user
// @route   PUT /api/admin/users/:id/ban
// @access  Private/Admin
const banUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(400).json({ message: 'Cannot ban an admin' });
        }

        user.isBanned = true;
        await user.save();

        res.json({ message: 'User banned successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Activate a user
// @route   PUT /api/admin/users/:id/activate
// @access  Private/Admin
const activateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isBanned = false;
        await user.save();

        res.json({ message: 'User activated successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAdminStats,
    getAllVets,
    approveVet,
    rejectVet,
    getAllUsers,
    banUser,
    activateUser
};
