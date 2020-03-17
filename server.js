const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

// MongoDB:
const mongoose = require("mongoose");
process.env.MONGO_URI =
  "mongodb+srv://dbMahmoud:asdf3456@cluster0-bhjwz.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Testing:
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CSS/HTML:
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// API Router:
const apiRouter = require("./routes/api");
app.use("/api/exercise", apiRouter);

// Not found middleware:
app.use((req, res, next) => {
  return next({ status: 404, message: "not found" });
});

// Error Handling middleware:
app.use((err, req, res, next) => {
  let errCode, errMessage;

  if (err.errors) {
    // mongoose validation error
    errCode = 400; // bad request
    const keys = Object.keys(err.errors);
    // report the first validation error
    errMessage = err.errors[keys[0]].message;
  } else {
    // generic or custom error
    errCode = err.status || 500;
    errMessage = err.message || "Internal Server Error";
  }
  res
    .status(errCode)
    .type("txt")
    .send(errMessage);
});

// GET /api/exercise/log?userId={userId}[&from][&to][&limit]
// https://fuschia-custard.glitch.me/api/exercise/log?userId=SyKsUMHNm&from=2014-01-08&to=2018-07-24&limit=5

// PORT:
const listener = app.listen(3000 || process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
