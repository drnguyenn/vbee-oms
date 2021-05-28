const router = require('express').Router();

const {
  searchDomainsValidator,
  createDomainValidator,
  updateDomainValidator,
  getDomainsSslStatusValidator
} = require('@validators/domain.validators');

const asyncMiddleware = require('@middlewares/async.middlewares');
const { auth, systemAdminCheck } = require('@middlewares/user.middlewares');

const DomainController = require('@controllers/domain.controller');

router.get(
  '/domains/ssl',
  auth,
  getDomainsSslStatusValidator,
  asyncMiddleware(DomainController.getSslStatus)
);

router.get('/domains/:id', auth, asyncMiddleware(DomainController.getDomain));

router.get(
  '/domains',
  auth,
  systemAdminCheck,
  searchDomainsValidator,
  asyncMiddleware(DomainController.searchDomains)
);

router.post(
  '/domains',
  auth,
  systemAdminCheck,
  createDomainValidator,
  asyncMiddleware(DomainController.createDomains)
);

router.put(
  '/domains/:id',
  auth,
  updateDomainValidator,
  asyncMiddleware(DomainController.updateDomain)
);

router.delete(
  '/domains/:id',
  auth,
  asyncMiddleware(DomainController.deleteDomain)
);

module.exports = router;
