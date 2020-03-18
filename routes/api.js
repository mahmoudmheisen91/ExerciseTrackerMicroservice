const User = require("../models/user");
const Exercise = require("../models/exercise");

let express = require("express");
let router = express.Router();

// Greeting endpoint...
// GET Greeting: GET /api/exercise/hello
router.get("/hello", (req, res) => {
  res.json({ greetings: "Hello, API" });
});

// Create user endpoint...
// POST Create users: POST /api/exercise/new-user
router.post("/new-user", (req, res, next) => {
  let user = new User(req.body);
  user.save((err, userData) => {
    if (err) return next(err);
    res.json({
      username: userData.username,
      _id: userData._id
    });
  });
});

// Get all users endpoint...
// GET /api/exercise/users
router.get("/users", (req, res, next) => {
  User.find({}, (err, data) => {
    if (err) return next(err);
    res.json(data);
  });
});

// Add Exercises endpoint...
// POST Add Exercises: POST /api/exercise/add
router.post("/add", (req, res, next) => {
  User.findById(req.body.userID, (err, user) => {
    if (err) return next(err);

    // Validate userID:
    if (!user) {
      let err = new Error("unknown userId...");
      err.status = 400;
      return next(err);
    }

    let exercise = new Exercise(req.body);

    // Add optional inputs:
    if (!exercise.date) {
      exercise.date = new Date();
    }
    exercise.username = user.username;

    exercise.save((err, exerciseData) => {
      if (err) return next(err);
      let output = {};

      output.username = exerciseData.username;
      output._id = exerciseData.userID;
      output.description = exerciseData.description;
      output.duration = exerciseData.duration;
      output.date = new Date(exerciseData.date).toDateString();

      res.json(output);
    });
  });
});

// GET all exercise log endpoint...
// GET /api/exercise/logs
router.get("/logs", (req, res, next) => {
  Exercise.find({}, (err, data) => {
    if (err) return next(err);
    res.json(data);
  });
});

// GET users's exercise log endpoint...
// GET /api/exercise/log?{userID}[&from][&to][&limit]
router.get("/log", (req, res, next) => {
  let userID = req.query.userID;
  let from = new Date(req.query.from);
  let to = new Date(req.query.to);
  let limit = req.query.limit;

  User.findById(userID, (err, user) => {
    if (err) return next(err);

    // Validate userID:
    if (!user) {
      let err = new Error("unknown userId...");
      err.status = 400;
      return next(err);
    }

    Exercise.find({
      userID: userID,
      date: {
        $gt: from != "Invalid Date" ? from.getTime() : 0,
        $lt: to != "Invalid Date" ? to.getTime() : new Date()
      }
    })
      .limit(limit)
      .exec((err, data) => {
        if (err) return next(err);
        let output = {
          _id: userID,
          username: user.username,
          from: from != "Invalid Date" ? from.toDateString() : undefined,
          to: to != "Invalid Date" ? to.toDateString() : undefined,
          count: data.length,
          log: data.map(e => ({
            description: e.description,
            duration: e.duration,
            date: e.date.toDateString()
          }))
        };
        res.json(output);
      });
  });
});

module.exports = router;
