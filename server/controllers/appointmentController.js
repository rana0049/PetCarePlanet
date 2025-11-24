const Appointment = require('../models/Appointment');
const User = require('../models/User');

// @desc    Book an appointment
// @route   POST /api/appointments
// @access  Private (Pet Owner)
const bookAppointment = async (req, res) => {
    const { vetId, petId, date, timeSlot, reason } = req.body;

    try {
        const appointment = new Appointment({
            petOwner: req.user._id,
            vet: vetId,
            pet: petId,
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
            .populate('petOwner', 'name email')
            .populate('vet', 'name clinicAddress')
            .populate('pet', 'name type');

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update appointment status (Vet only)
// @route   PUT /api/appointments/:id/status
// @access  Private (Vet)
const updateAppointmentStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const appointment = await Appointment.findById(req.params.id);

        if (appointment && appointment.vet.toString() === req.user._id.toString()) {
            appointment.status = status;
            const updatedAppointment = await appointment.save();
            res.json(updatedAppointment);
        } else {
            res.status(404).json({ message: 'Appointment not found or unauthorized' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { bookAppointment, getAppointments, updateAppointmentStatus };
