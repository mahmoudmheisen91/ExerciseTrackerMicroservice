const mongoose = require("mongoose");

let Schema = mongoose.Schema;
let ExerciseSchema = new Schema({
  username: {
    type: String
  },
  userID: {
    type: String,
    required: true,
    ref: "User"
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: false
  }
});

let Exercise = mongoose.model("Exercise", ExerciseSchema);

module.exports = Exercise;
