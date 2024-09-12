const ClassSchedule = require('../models/ScheduleModel');

// POST: Create a new class schedule
exports.createClassSchedule = async (req, res) => {
  try {
    const classSchedule = new ClassSchedule(req.body);
    await classSchedule.save();
    res.status(201).json(classSchedule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET: Retrieve all class schedules
exports.getClassSchedules = async (req, res) => {
  try {
    const classSchedules = await ClassSchedule.find()
      .populate('teacher')
      .populate('students');
    res.status(200).json(classSchedules);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
