/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
require('module-alias/register');
const express = require('express');
const path = require('path');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');

const camelCaseReq = require('@middlewares/camel-case-req.middlewares');
const omitReq = require('@middlewares/omit-req.middlewares');
const snakeCaseRes = require('@middlewares/snake-case-res.middlewares');
const rawBodySaver = require('@middlewares/raw-body-saver.middlewares');
const errorHandler = require('@middlewares/error-handler.middlewares');

const { SERVER_PORT } = require('@configs');

const app = express();

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();

  const morgan = require('morgan');
  app.use(morgan('dev'));
}

require('@models');

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

require('@routes')(app);

app.use(errorHandler);

const { initialSetup } = require('@services');

let server;

if (process.env.NODE_ENV === 'production') {
  const https = require('https');
  const fs = require('fs');

  const options = {
    cert: fs.readFileSync('/etc/ssl/certs/web-server.crt'),
    key: fs.readFileSync('/etc/ssl/certs/web-server.key')
  };

  server = https.createServer(options, app).listen(SERVER_PORT, async () => {
    await initialSetup();

    console.info(`Server is running on port ${SERVER_PORT}`);
  });
} else {
  server = app.listen(SERVER_PORT, async () => {
    await initialSetup();

    console.info(`Server is running on port ${SERVER_PORT}`);
  });
}

const gracefulShutdown = () => {
  console.info('SIGTERM/SIGINT signal received: closing HTTP server');

  server.close(() => console.info('HTTP server closed'));
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
