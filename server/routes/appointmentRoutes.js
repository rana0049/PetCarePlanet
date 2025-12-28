const express = require('express');
const { bookAppointment, getAppointments, updateAppointmentStatus } = require('../controllers/appointmentController');
const { protect, vet } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').post(protect, bookAppointment).get(protect, getAppointments);
router.route('/:id/status').put(protect, updateAppointmentStatus);

module.exports = router;
