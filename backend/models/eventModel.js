const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    eventType: {
        type: String,
        required: [true, 'Please specify event type'],
        enum: ['Wedding', 'Corporate', 'Birthday', 'Anniversary', 'Other']
    },
    eventDate: {
        type: Date,
        required: [true, 'Please specify event date']
    },
    guestCount: {
        type: Number,
        required: [true, 'Please specify number of guests']
    },
    menuPackage: {
        type: String,
        required: [true, 'Please select a menu package'],
        enum: ['Basic', 'Premium', 'Deluxe']
    },
    venue: {
        address: String,
        city: String,
        state: String,
        zipCode: String
    },
    specialRequirements: String,
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
        default: 'Pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Event', eventSchema); 