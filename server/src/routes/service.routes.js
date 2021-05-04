const router = require('express').Router();

const {
  searchServicesValidator,
  createServiceValidator,
  updateServiceValidator,
  addMemberValidator,
  updateMemberValidator
} = require('../validators/service.validators');

const asyncMiddleware = require('../middlewares/async.middlewares');
const { auth, systemAdminCheck } = require('../middlewares/user.middlewares');

const ServiceController = require('../controllers/service.controller');

router.get(
  '/services/:id',
  auth,
  asyncMiddleware(ServiceController.getService)
);

router.get(
  '/services',
  auth,
  systemAdminCheck,
  searchServicesValidator,
  asyncMiddleware(ServiceController.searchServices)
);

router.post(
  '/services',
  auth,
  systemAdminCheck,
  createServiceValidator,
  asyncMiddleware(ServiceController.createService)
);

router.put(
  '/services/:id',
  auth,
  updateServiceValidator,
  asyncMiddleware(ServiceController.updateService)
);

router.delete(
  '/services/:id',
  auth,
  asyncMiddleware(ServiceController.deleteService)
);

router.post(
  '/services/:id/members/:userId',
  auth,
  addMemberValidator,
  asyncMiddleware(ServiceController.addMember)
);

router.put(
  '/services/:id/members/:userId',
  auth,
  updateMemberValidator,
  asyncMiddleware(ServiceController.updateMember)
);

router.delete(
  '/services/:id/members/:userId',
  auth,
  asyncMiddleware(ServiceController.removeMember)
);

router.delete(
  '/services/members/:userId',
  auth,
  asyncMiddleware(ServiceController.removeMemberFromAllServices)
);

module.exports = router;
