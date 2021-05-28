const DiagramService = require('@services/diagram.service');

const getDiagram = async (req, res) => {
  const { id } = req.params;

  const diagram = await DiagramService.get(id);

  return res.json({ status: 1, result: { diagram } });
};

const searchDiagrams = async (req, res) => {
  const diagrams = await DiagramService.search(req.query);

  return res.json({ status: 1, result: { diagrams } });
};

const updateDiagramElements = async (req, res) => {
  const { statusCode } = await DiagramService.updateElements(req.body);

  return res.status(statusCode).json({
    status: statusCode < 400 ? 1 : 0
  });
};

const removeDiagramElements = async (req, res) => {
  const { statusCode } = await DiagramService.removeElements(req.body);

  return res.status(statusCode).json({
    status: statusCode < 400 ? 1 : 0
  });
};

const addNode = async (req, res) => {
  const { diagramNode, statusCode } = await DiagramService.addNode(req.body);

  return res.status(statusCode).json({
    status: statusCode < 400 ? 1 : 0,
    result: { diagramNode }
  });
};

const updateNode = async (req, res) => {
  const { id } = req.params;

  const { diagramNode, statusCode } = await DiagramService.updateNode(
    id,
    req.body
  );

  return res.status(statusCode).json({
    status: statusCode < 400 ? 1 : 0,
    result: { diagramNode }
  });
};

const removeNode = async (req, res) => {
  const { id } = req.params;

  const { diagramNode, statusCode } = await DiagramService.removeNode(id);

  return res.status(statusCode).json({
    status: statusCode < 400 ? 1 : 0,
    result: { diagramNode }
  });
};

const addPort = async (req, res) => {
  const { diagramPort, statusCode } = await DiagramService.addPort(req.body);

  return res.status(statusCode).json({
    status: statusCode < 400 ? 1 : 0,
    result: { diagramPort }
  });
};

const updatePort = async (req, res) => {
  const { id } = req.params;

  const { diagramPort, statusCode } = await DiagramService.updatePort(
    id,
    req.body
  );

  return res.status(statusCode).json({
    status: statusCode < 400 ? 1 : 0,
    result: { diagramPort }
  });
};

const removePort = async (req, res) => {
  const { id } = req.params;

  const { diagramPort, statusCode } = await DiagramService.removePort(id);

  return res.status(statusCode).json({
    status: statusCode < 400 ? 1 : 0,
    result: { diagramPort }
  });
};

const addLink = async (req, res) => {
  const { diagramLink, statusCode } = await DiagramService.addLink(req.body);

  return res.status(statusCode).json({
    status: statusCode < 400 ? 1 : 0,
    result: { diagramLink }
  });
};

const updateLink = async (req, res) => {
  const { id } = req.params;

  const { diagramLink, statusCode } = await DiagramService.updateLink(
    id,
    req.body
  );

  return res.status(statusCode).json({
    status: statusCode < 400 ? 1 : 0,
    result: { diagramLink }
  });
};

const removeLink = async (req, res) => {
  const { id } = req.params;

  const { diagramLink, statusCode } = await DiagramService.removeLink(id);

  return res.status(statusCode).json({
    status: statusCode < 400 ? 1 : 0,
    result: { diagramLink }
  });
};

module.exports = {
  getDiagram,
  searchDiagrams,
  updateDiagramElements,
  removeDiagramElements,
  addNode,
  updateNode,
  removeNode,
  addPort,
  updatePort,
  removePort,
  addLink,
  updateLink,
  removeLink
};
