const mongoose = require('mongoose');
const { Schema } = mongoose;

const classScheduleSchema = new Schema({
   meetingId: {
        type: String,
        required: true
      },
  className: {
    type: String,
    required: true
  },
  subjectName: {
    type: String,
    required: true
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  students: [{
    type: Schema.Types.ObjectId,
    ref: 'Student'
  }],
  schedule: {
    date: {
      type: Date,
      required: true
    },
    time: {
      type: String, // or Date, depending on your needs
      required: true
    }
  }
});

const ClassSchedule = mongoose.model('ClassSchedule', classScheduleSchema);

module.exports = ClassSchedule;
