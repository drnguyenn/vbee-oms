/* eslint-disable no-console */
const mongoose = require('mongoose');
const { MONGO_URI } = require('@configs');

mongoose.connect(MONGO_URI, {
  autoIndex: false,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error');
  console.error(err);
  process.exit();
});

mongoose.connection.once('open', () => {
  console.log(`Connected to MongoDB`);
});
