const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const Logger = require('../config/logger');
const cloudinary = require('../utils/cloudinary');
const morgan = require('morgan');


const app = express();

global.logger = Logger.createLogger({ label: 'Insgtagram Clone' });

app.use(cookieParser());
app.use(helmet());
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('combined', { stream: logger.stream }));
cloudinary();



app.get('/', (req, res) => {
  res.send('Instagram Clone');
});

module.exports = app;
