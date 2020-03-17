const User = require("../models/user");

let express = require("express");
let router = express.Router();

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
