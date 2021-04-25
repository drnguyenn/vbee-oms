/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const path = require('path');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');

const camelCaseReq = require('./middlewares/camel-case-req.middlewares');
const omitReq = require('./middlewares/omit-req.middlewares');
const snakeCaseRes = require('./middlewares/snake-case-res.middlewares');
const rawBodySaver = require('./middlewares/raw-body-saver.middlewares');
const errorHandler = require('./middlewares/error-handler.middlewares');

require('./models');

const { SERVER_PORT } = require('./configs');

const app = express();

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();

  const morgan = require('morgan');
  app.use(morgan('dev'));
}

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json({ verify: rawBodySaver }));
app.use(express.urlencoded({ verify: rawBodySaver, extended: true }));
app.use(express.raw({ verify: rawBodySaver, type: '*/*' }));
app.use(camelCaseReq);
app.use(omitReq);
app.use(snakeCaseRes());
app.use(express.static(path.join(__dirname, '..', 'public')));

require('./routes')(app);

app.use(errorHandler);

const initialSetup = require('./services');

app.listen(SERVER_PORT, async () => {
  await initialSetup();

  console.log(`Server is running on port ${SERVER_PORT}`);
});
