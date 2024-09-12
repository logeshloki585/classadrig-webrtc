const express = require('express');
const router = express.Router();
const classScheduleController = require('../controller/Controller');

// POST: Create a new class schedule
router.post('/class-schedules', classScheduleController.createClassSchedule);

// GET: Retrieve all class schedules
router.get('/class-schedules', classScheduleController.getClassSchedules);

module.exports = router;
