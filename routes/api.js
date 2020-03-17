const User = require("../models/user");

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
      id: userData.id
    });
  });
});

module.exports = router;
