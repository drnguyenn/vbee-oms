const router = require('express').Router();

const {
  searchDiagramsValidator,
  updateDiagramElementsValidator,
  removeDiagramElementsValidator,
  addNodeValidator,
  updateNodeValidator,
  addPortValidator,
  updatePortValidator,
  addLinkValidator,
  updateLinkValidator
} = require('@validators/diagram.validators');

const asyncMiddleware = require('@middlewares/async.middlewares');
const { auth } = require('@middlewares/auth.middlewares');

const DiagramController = require('@controllers/diagram.controller');

router.get(
  '/diagrams/:id',
  auth,
  asyncMiddleware(DiagramController.getDiagram)
);

router.get(
  '/diagrams',
  auth,
  searchDiagramsValidator,
  asyncMiddleware(DiagramController.searchDiagrams)
);

router.put(
  '/diagram-elements',
  auth,
  updateDiagramElementsValidator,
  asyncMiddleware(DiagramController.updateDiagramElements)
);

router.delete(
  '/diagram-elements',
  auth,
  removeDiagramElementsValidator,
  asyncMiddleware(DiagramController.removeDiagramElements)
);

router.post(
  '/diagram-nodes',
  auth,
  addNodeValidator,
  asyncMiddleware(DiagramController.addNode)
);

router.put(
  '/diagram-nodes/:id',
  auth,
  updateNodeValidator,
  asyncMiddleware(DiagramController.updateNode)
);

router.delete(
  '/diagram-nodes/:id',
  auth,
  asyncMiddleware(DiagramController.removeNode)
);

router.post(
  '/diagram-ports',
  auth,
  addPortValidator,
  asyncMiddleware(DiagramController.addPort)
);

router.put(
  '/diagram-ports/:id',
  auth,
  updatePortValidator,
  asyncMiddleware(DiagramController.updatePort)
);

router.delete(
  '/diagram-ports/:id',
  auth,
  asyncMiddleware(DiagramController.removePort)
);

router.post(
  '/diagram-links',
  auth,
  addLinkValidator,
  asyncMiddleware(DiagramController.addLink)
);

router.put(
  '/diagram-links/:id',
  auth,
  updateLinkValidator,
  asyncMiddleware(DiagramController.updateLink)
);

router.delete(
  '/diagram-links/:id',
  auth,
  asyncMiddleware(DiagramController.removeLink)
);

module.exports = router;
