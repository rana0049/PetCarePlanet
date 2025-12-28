const User = require('../models/User');

// @desc    Get all approved vets
// @route   GET /api/users/vets
// @access  Public
const getVets = async (req, res) => {
    try {
        const vets = await User.find({ role: 'vet', isApproved: true })
            .select('-password'); // Exclude password
        res.json(vets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            // Vet specific fields
            if (user.role === 'vet') {
                user.specialization = req.body.specialization || user.specialization;
                user.experience = req.body.experience || user.experience;
                user.clinicAddress = req.body.clinicAddress || user.clinicAddress;
                user.vetCategory = req.body.vetCategory || user.vetCategory;
            }

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                specialization: updatedUser.specialization,
                vetCategory: updatedUser.vetCategory,
                experience: updatedUser.experience,
                clinicAddress: updatedUser.clinicAddress,
                token: req.body.token // Keep existing token or generate new one if needed (usually just keep existing on client)
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getVets, updateUserProfile };
