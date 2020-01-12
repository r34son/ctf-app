const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const router = require('./routes');
const config = require('./helpers/config');
const {
  mongo: { url, username, password },
  port: configPort
} = config;
const Timer = require('./timer');

mongoose.connect(
  `mongodb+srv://${username}:${password}@${url}`,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  err => {
    if (err) return console.log(err);

    console.log('Connected to MongoDB!');
  }
);

const port = process.env.PORT || configPort || 80;

const app = express();
app
  .use(cors())
  .use(morgan('dev'))
  .use(express.json())
  .use(express.static(path.join(__dirname, '../build')))
  .use(express.static(path.join(__dirname, '../tasks')))
  .use('/', router);

const server = app.listen(port, () =>
  console.log(`Server is running on port ${port}`)
);

const io = require('socket.io')(server);
const onTick = data => io.sockets.emit('timer:tick', data);
const timer = new Timer(onTick);

io.on('connection', client => {
  console.log('connected');
  client.on('timer:start', time => timer.start(time));
  client.on('timer:stop', timer.stop);
  client.on('timer:pause', timer.pause);
  client.on('timer:resume', timer.resume);
  client.on('disconnect', () => console.log('disconnected'));
});
