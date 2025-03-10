const Event = require('../models/eventModel');

// @desc    Create new event
// @route   POST /api/events
// @access  Private
const createEvent = async (req, res) => {
    try {
        // Validate event date is not in the past
        const eventDate = new Date(req.body.eventDate);
        eventDate.setHours(0, 0, 0, 0);
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (eventDate < today) {
            return res.status(400).json({ message: 'Event date cannot be in the past' });
        }

        const event = await Event.create({
            ...req.body,
            user: req.user._id
        });
        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all events (staff only)
// @route   GET /api/events
// @access  Private/Staff
const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find({})
            .populate({
                path: 'user',
                select: 'name email phone'
            })
            .sort({ eventDate: -1 });

        // Map events to include user data and log for debugging
        const validEvents = events.map(event => {
            const eventObj = event.toObject();
            console.log('Backend - Event user data:', eventObj.user); // Debug log
            
            // Ensure user data is properly included
            if (!eventObj.user) {
                eventObj.user = {
                    name: 'Unknown',
                    email: 'N/A',
                    phone: 'N/A'
                };
            }
            return eventObj;
        });

        res.json(validEvents);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get user events
// @route   GET /api/events/myevents
// @access  Private
const getUserEvents = async (req, res) => {
    try {
        const events = await Event.find({ user: req.user._id });
        res.json(events);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Private
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('user', 'name email');

        if (event) {
            res.json(event);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
const updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Make sure user owns event or is staff
        if (event.user.toString() !== req.user._id.toString() && req.user.role === 'user') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Make sure user owns event or is staff
        if (event.user.toString() !== req.user._id.toString() && req.user.role === 'user') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await event.remove();
        res.json({ message: 'Event removed' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createEvent,
    getAllEvents,
    getUserEvents,
    getEventById,
    updateEvent,
    deleteEvent,
}; 