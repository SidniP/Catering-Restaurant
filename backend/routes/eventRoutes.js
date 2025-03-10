const express = require('express');
const router = express.Router();
const {
    createEvent,
    getAllEvents,
    getUserEvents,
    getEventById,
    updateEvent,
    deleteEvent,
} = require('../controllers/eventController');
const { protect, staffOnly } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createEvent)
    .get(protect, staffOnly, getAllEvents);

router.get('/myevents', protect, getUserEvents);

router.route('/:id')
    .get(protect, getEventById)
    .put(protect, updateEvent)
    .delete(protect, deleteEvent);

module.exports = router; 