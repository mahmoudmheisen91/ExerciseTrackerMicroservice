const mongoose = require("mongoose");
const shortID = require("shortid");

let Schema = mongoose.Schema;
let UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  id: {
    type: String,
    default: shortID.generate
  }
});

let User = mongoose.model("User", UserSchema);

module.exports = User;
