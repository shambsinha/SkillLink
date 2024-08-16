const mongoose = require('mongoose');

// Define the schema for a booking
const bookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    zip: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
});

// Create the Booking model
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;