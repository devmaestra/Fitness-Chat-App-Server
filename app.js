require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4001;

const cors = require('cors');






// MIDDLEWARE
const log = console.log;
app.use(express.json());
app.use(cors());





// ROUTES










app.listen(PORT, () => log(`Chat server is running on Port: ${PORT}`));