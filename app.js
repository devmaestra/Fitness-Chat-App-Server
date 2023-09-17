require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const MONGO = process.env.MONGO;
const app = express();
const PORT = process.env.PORT || 4001;
const cors = require('cors');

const user = require ('./controllers/user.controller');
const conversation = require('./controllers/conversation.controller') //added


// MIDDLEWARE
const log = console.log;
mongoose.connect (`${MONGO}/FitnessApp`);
const db = mongoose.connection;
db.once("open", () => log(`Connect: ${MONGO}`));

app.use(express.json());
app.use(cors());

// ROUTES

app.use('/user', user);
app.use('/conversation', conversation) //added






// CONNECTION


app.listen(PORT, () => log(`Chat server is running on Port: ${PORT}`));