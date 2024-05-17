const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WorkoutSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  repetitions: {
    type: Number,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // assuming you have a User model
    required: true,
  }
});

module.exports = mongoose.model('Workout', WorkoutSchema);