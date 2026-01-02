const Appointment = require('../models/Appointment');
const User = require('../models/User');

// @desc    Book an appointment
// @route   POST /api/appointments
// @access  Private (Pet Owner)
const bookAppointment = async (req, res) => {
    const { vetId, petId, petName, petSpecies, date, timeSlot, reason } = req.body;

    try {
        if (!petId && (!petName || !petSpecies)) {
            return res.status(400).json({ message: 'Please provide either a registered pet or pet name and species' });
        }

        const appointment = new Appointment({
            petOwner: req.user._id,
            vet: vetId,
            pet: petId || undefined,
            petName: petId ? undefined : petName,
            petSpecies: petId ? undefined : petSpecies,
            date,
            timeSlot,
            reason,
        });

        const createdAppointment = await appointment.save();
        res.status(201).json(createdAppointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get appointments for logged in user (Owner or Vet)
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res) => {
    try {
        let query;
        if (req.user.role === 'vet') {
            query = { vet: req.user._id };
        } else {
            query = { petOwner: req.user._id };
        }

        const appointments = await Appointment.find(query)
            .populate('petOwner', 'name email phone')
            .populate('vet', 'name clinicAddress')
            .populate('pet', 'name type');

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update appointment status (Vet or Pet Owner for cancellation)
// @route   PUT /api/appointments/:id/status
// @access  Private
const updateAppointmentStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Allow Appointment Owner to CANCEL only if it's their appointment
        // REMOVED 'pending' check to allow cancelling confirmed appointments too
        if (appointment.petOwner.toString() === req.user._id.toString()) {
            const requestedStatus = status.toLowerCase().trim();

            if (requestedStatus === 'cancelled') {
                // User requested simple deletion ("delete that instance")
                await Appointment.findByIdAndDelete(req.params.id);
                return res.json({ message: 'Appointment deleted', _id: req.params.id, status: 'cancelled' });
            } else {
                return res.status(400).json({ message: 'Pet owners can only cancel appointments.' });
            }
        }

        // Detailed Auth Error
        return res.status(401).json({
            message: `Not authorized. You (${req.user._id}) do not own this appointment (${appointment.petOwner}).`
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { bookAppointment, getAppointments, updateAppointmentStatus };
