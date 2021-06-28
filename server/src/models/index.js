/* eslint-disable no-console */
const mongoose = require('mongoose');

const { MONGO_URI } = require('@configs');

const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_DATABASE } = process.env;

mongoose.connect(MONGO_URI, {
  user: MONGO_USERNAME,
  pass: MONGO_PASSWORD,
  dbName: MONGO_DATABASE,

  autoIndex: false,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  ignoreUndefined: true
});

mongoose.set('runValidators', true);
mongoose.set('strict', 'throw');
mongoose.set('strictQuery', 'throw');
mongoose.set('toJSON', { virtuals: true });
mongoose.set('toObject', { virtuals: true });
mongoose.set('typePojoToMixed', false);

// mongoose.plugin(schema => {
//   schema.pre('findOneAndUpdate', setRunValidators);
//   schema.pre('updateMany', setRunValidators);
//   schema.pre('updateOne', setRunValidators);
//   schema.pre('update', setRunValidators);
// });

// function setRunValidators() {
//   if ('runValidators' in this.getOptions()) return;

//   this.setOptions({ runValidators: true });
// }

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error');
  console.error(err);
  process.exit();
});

mongoose.connection.once('open', () => {
  console.info(`Connected to MongoDB`);
});
