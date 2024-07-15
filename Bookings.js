const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    id: {
        type: String
    },
    userId: {
        type: String
    },
    name: {
        type: String
    },
    auditorium: {
        type: String
    },
    date: {
        type: Date
    },
    slot: {
        type: String
    },
    title: {
        type: String
    },
    start: {
        type: String
    },
    end: {
        type: String
    },
    status: {
        type: String
    },
    department: {
        type: String
    },
    amenities: {
        type: Array
    },
    eventname: {
        type: String
    }
});

const Booking = mongoose.model("Bookings", bookingSchema);
module.exports = Booking;