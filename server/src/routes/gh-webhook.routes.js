const router = require('express').Router();

const { webhookValidator } = require('@validators/gh-webhook.validators');

const asyncMiddleware = require('@middlewares/async.middlewares');

const {
  signatureVerification
} = require('@middlewares/gh-webhook.middlewares');

const GhWebhookController = require('@controllers/gh-webhook.controller');

router.post(
  '/webhooks/github',
  webhookValidator,
  signatureVerification,
  asyncMiddleware(GhWebhookController.handleEvents)
);

module.exports = router;
