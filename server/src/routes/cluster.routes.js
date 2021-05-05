const router = require('express').Router();

const {
  searchClustersValidator,
  createClusterValidator,
  updateClusterValidator,
  addMemberValidator,
  updateMemberValidator
} = require('@validators/cluster.validators');

const asyncMiddleware = require('@middlewares/async.middlewares');
const { auth, systemAdminCheck } = require('@middlewares/user.middlewares');

const ClusterController = require('@controllers/cluster.controller');

router.get(
  '/clusters/:id',
  auth,
  asyncMiddleware(ClusterController.getCluster)
);

router.get(
  '/clusters',
  auth,
  systemAdminCheck,
  searchClustersValidator,
  asyncMiddleware(ClusterController.searchClusters)
);

router.post(
  '/clusters',
  auth,
  systemAdminCheck,
  createClusterValidator,
  asyncMiddleware(ClusterController.createCluster)
);

router.put(
  '/clusters/:id',
  auth,
  updateClusterValidator,
  asyncMiddleware(ClusterController.updateCluster)
);

router.delete(
  '/clusters/:id',
  auth,
  asyncMiddleware(ClusterController.deleteCluster)
);

router.post(
  '/clusters/:id/members/:userId',
  auth,
  addMemberValidator,
  asyncMiddleware(ClusterController.addMember)
);

router.put(
  '/clusters/:id/members/:userId',
  auth,
  updateMemberValidator,
  asyncMiddleware(ClusterController.updateMember)
);

router.delete(
  '/clusters/:id/members/:userId',
  auth,
  asyncMiddleware(ClusterController.removeMember)
);

router.delete(
  '/clusters/members/:userId',
  auth,
  asyncMiddleware(ClusterController.removeMemberFromAllClusters)
);

module.exports = router;
