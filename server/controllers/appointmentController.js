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

        const requestedStatus = status.toLowerCase().trim();

        // 1. If User is the Vet for this appointment
        if (appointment.vet.toString() === req.user._id.toString()) {
            if (['confirmed', 'cancelled'].includes(requestedStatus)) {
                appointment.status = requestedStatus;
                await appointment.save();
                return res.json(appointment);
            } else {
                return res.status(400).json({ message: 'Vets can only confirm or cancel appointments.' });
            }
        }

        // 2. If User is the Pet Owner
        if (appointment.petOwner.toString() === req.user._id.toString()) {
            if (requestedStatus === 'cancelled') {
                // User requested simple deletion ("delete that instance")
                // OR update status to cancelled? 
                // Previous logic was delete. Let's stick to update status to 'cancelled' mostly, 
                // but the previous code did findByIdAndDelete.
                // NOTE: The previous code did `await Appointment.findByIdAndDelete(req.params.id);`
                // Let's keep it consistent or improve. Deleting destroys history.
                // Ideally we should set status='cancelled'. 
                // But sticking to previous behavior for Owner to avoid breaking changes unless requested.
                // ACTUALLY, the user complaint is "vet cannot accept or reject". 
                // I should just ADD Vet logic and keep Owner logic as is for now to be safe, 
                // OR improve owner logic to just cancel locally.
                // Let's just set status to cancelled for consistency if I can.
                // BUT, to avoid breaking 'delete' expectation if any, I'll stick to what was there for Owner?
                // No, the previous code had a comment: // User requested simple deletion ("delete that instance")

                await Appointment.findByIdAndDelete(req.params.id);
                return res.json({ message: 'Appointment deleted', _id: req.params.id, status: 'cancelled' });
            } else {
                return res.status(400).json({ message: 'Pet owners can only cancel appointments.' });
            }
        }

        // Detailed Auth Error
        return res.status(401).json({
            message: `Not authorized. You are not the owner or vet for this appointment.`
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { bookAppointment, getAppointments, updateAppointmentStatus };
