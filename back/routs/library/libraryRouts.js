const express = require('express')
const router = express.Router()
const {protect} = require('../../middleware/authMiddleware')
const Envets = require('../../models/EventModel.js')

const { createEvent, getEvents, updateEvent, deleteEvent, getAllEvents, verifyEvent } = require('./libraryController')

router.post('/', protect, createEvent)
router.get('/',  getEvents) // only user Events
router.put('/:id',protect, updateEvent)
router.delete('/:id', protect, deleteEvent)
router.put("/verify/:id", protect, verifyEvent)

module.exports = router