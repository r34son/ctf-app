const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const router = require('./routes');
const config = require('./helpers/config');

const { mongo: { url, username, password }, port: configPort } = config;

mongoose.connect(
  `mongodb://${username}:${password}@${url}`, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  err => {
    if (err) return console.log(err);

    console.log('Connected to MongoDB!');
  }
);

const port = process.env.PORT || configPort || 80;

const app = express();
app.use(cors())
  .use(morgan('dev'))
  .use(express.json())
  .use(express.static(path.join(__dirname, '../build')))
  .use('/', router)
  .listen(port, () => console.log(`Server is running on port ${ port }`));
