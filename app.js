require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const MONGO = process.env.MONGO;
const app = express();
const PORT = process.env.PORT || 4001;
const cors = require("cors");
const bcrypt = require("bcrypt");

//AWS s3 bucket
const uploadURL = require("./s3");

const user = require("./controllers/user.controller");
const conversation = require("./controllers/conversation.controller"); //added
const message = require("./controllers/message.controller");

// MIDDLEWARE
const log = console.log;
mongoose.connect(`${MONGO}/FitnessApp`);
const db = mongoose.connection;
db.once("open", () => log(`Connect: ${MONGO}`));

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

// ROUTES

// AWS s3 Bucket
app.get("/geturl", async (req, res) => {
  const url = await uploadURL();
  console.log(typeof url);

  res.status(200).json(url);
});

app.use("/user", user);
app.use("/conversation", conversation); //added
app.use("/message", message); //added

// CONNECTION

app.listen(PORT, () => log(`Chat server is running on Port: ${PORT}`));
