/* eslint-disable no-console */
const CustomError = require('@errors/custom-error');
const errorCodes = require('@errors/code');

const DiagramDao = require('@daos/diagram.dao');
const DiagramNodeDao = require('@daos/diagram-node.dao');
const DiagramPortDao = require('@daos/diagram-port.dao');
const DiagramLinkDao = require('@daos/diagram-link.dao');
const ClusterDao = require('@daos/cluster.dao');

const ServiceService = require('./service.service');

const get = async (condition, projection) => {
  const diagram = await DiagramDao.findOne(condition, projection);

  if (!diagram)
    throw new CustomError(errorCodes.NOT_FOUND, 'Diagram not found');

  return diagram;
};

const create = async data => {
  if (!(await ClusterDao.findOne(data.clusterId)))
    throw new CustomError(errorCodes.NOT_FOUND, 'Cluster not found');

  const diagram = await DiagramDao.create(data);

  return diagram;
};

const update = async (condition, data) => {
  if (data.clusterId)
    if (!(await ClusterDao.findOne(data.clusterId)))
      throw new CustomError(errorCodes.NOT_FOUND, 'Cluster not found');

  const diagram = await DiagramDao.update(condition, data);

  return {
    statusCode: diagram.createdAt === diagram.updatedAt ? 201 : 200,
    diagram
  };
};

const remove = async condition => {
  const diagram = await DiagramDao.remove(condition);

  if (!diagram)
    throw new CustomError(errorCodes.NOT_FOUND, 'Diagram not found');

  const { nodes } = diagram;

  if (nodes.length) await removeAllNodes(nodes.map(node => node._id));

  return diagram;
};

const search = async (condition, projection = { name: 1, description: 1 }) => {
  if (condition.q) {
    const diagrams = await DiagramDao.search(condition.q, projection);
    return diagrams;
  }

  const diagrams = await DiagramDao.findAll(condition, projection);
  return diagrams;
};

const updateElements = async ({ nodes = {}, ports = {}, links = {} }) => {
  await Promise.all([
    ...Object.keys(nodes).map(key => updateNode(key, nodes[key])),
    ...Object.keys(ports).map(key => updatePort(key, ports[key])),
    ...Object.keys(links).map(key => updateLink(key, links[key]))
  ]);

  return {
    statusCode: 200
  };
};

const removeElements = async ({ nodes = [], ports = [], links = [] }) => {
  await Promise.all([
    removeAllNodes(nodes),
    removeAllPorts(ports),
    removeAllLinks(links)
  ]);

  return {
    statusCode: 200
  };
};

const addNode = async ({ name, diagramId, serviceId, ...rest }) => {
  get(diagramId);

  let service = {};
  if (serviceId) service = await ServiceService.get(serviceId);

  const diagramNode = await DiagramNodeDao.create({
    name: name || service.name,
    diagram: diagramId,
    service: serviceId,
    ...rest
  });

  return { diagramNode, statusCode: 201 };
};

const updateNode = async (
  nodeCondition,
  { name, diagramId, serviceId, ...rest }
) => {
  if (diagramId) get(diagramId);

  let service = {};
  if (serviceId) service = await ServiceService.get(serviceId);

  const diagramNode = await DiagramNodeDao.update(nodeCondition, {
    name: name || service.name,
    diagram: diagramId,
    service: serviceId,
    ...rest
  });

  return {
    diagramNode,
    statusCode: diagramNode.createdAt === diagramNode.updatedAt ? 201 : 200
  };
};

const removeNode = async nodeCondition => {
  const diagramNode = await DiagramNodeDao.removeOne(nodeCondition);

  if (!diagramNode)
    throw new CustomError(errorCodes.NOT_FOUND, 'Diagram node not found');

  const { ports } = diagramNode;

  if (ports.length) await removeAllPorts(ports.map(port => port._id));

  return { diagramNode, statusCode: 200 };
};

const removeAllNodes = async (nodeIds = []) => {
  const ports = await DiagramPortDao.findAll(
    {
      node: { $in: nodeIds }
    },
    '_id'
  );

  if (ports.length) await removeAllPorts(ports.map(port => port._id));

  const result = await DiagramNodeDao.removeAll({
    _id: { $in: nodeIds }
  });

  return result;
};

const addPort = async ({ nodeId, diagramId, ...rest }) => {
  get(diagramId);

  if (!(await DiagramNodeDao.findOne(nodeId)))
    throw new CustomError(errorCodes.NOT_FOUND, 'Diagram node not found');

  const diagramPort = await DiagramPortDao.create({
    node: nodeId,
    diagram: diagramId,
    ...rest
  });

  return { diagramPort, statusCode: 201 };
};

const updatePort = async (portCondition, { nodeId, diagramId, ...rest }) => {
  if (diagramId) get(diagramId);

  if (nodeId)
    if (!(await DiagramNodeDao.findOne(nodeId)))
      throw new CustomError(errorCodes.NOT_FOUND, 'Diagram node not found');

  const diagramPort = await DiagramPortDao.update(portCondition, {
    node: nodeId,
    diagram: diagramId,
    ...rest
  });

  return {
    diagramPort,
    statusCode: diagramPort.createdAt === diagramPort.updatedAt ? 201 : 200
  };
};

const removePort = async portCondition => {
  const diagramPort = await DiagramPortDao.removeOne(portCondition);

  if (!diagramPort)
    throw new CustomError(errorCodes.NOT_FOUND, 'Diagram port not found');

  const { links } = diagramPort._doc;

  if (links.length) await removeAllLinks(links.map(link => link._id));

  return { diagramPort, statusCode: 200 };
};

const removeAllPorts = async (portIds = []) => {
  await DiagramLinkDao.removeAll({
    $or: [
      {
        sourcePort: { $in: portIds }
      },
      {
        targetPort: { $in: portIds }
      }
    ]
  });

  const result = await DiagramPortDao.removeAll({
    _id: { $in: portIds }
  });

  return result;
};

const addLink = async ({ sourcePortId, targetPortId, diagramId, ...rest }) => {
  get(diagramId);

  const sourcePort = await DiagramPortDao.findOne(sourcePortId);
  if (!sourcePort)
    throw new CustomError(errorCodes.NOT_FOUND, 'Diagram port not found');
  // if (sourcePort.options.in === true)
  //   throw new CustomError(
  //     errorCodes.BAD_REQUEST,
  //     'In port cannot be a source port'
  //   );

  const targetPort = await DiagramPortDao.findOne(targetPortId);
  if (!targetPort)
    throw new CustomError(errorCodes.NOT_FOUND, 'Diagram port not found');
  // if (targetPort.options.in === false)
  //   throw new CustomError(
  //     errorCodes.BAD_REQUEST,
  //     'Out port cannot be a target port'
  //   );

  // if (sourcePort.options.in === targetPort.options.in)
  //   throw new CustomError(
  //     errorCodes.BAD_REQUEST,
  //     'Cannot link two ports of the same type'
  //   );

  const diagramLink = await DiagramLinkDao.create({
    sourcePort: sourcePortId,
    targetPort: targetPortId,
    diagram: diagramId,
    ...rest
  });

  return { diagramLink, statusCode: 201 };
};

const updateLink = async (
  linkCondition,
  { sourcePortId, targetPortId, diagramId, ...rest }
) => {
  if (diagramId) get(diagramId);

  if (sourcePortId) {
    const sourcePort = await DiagramPortDao.findOne(sourcePortId);
    if (!sourcePort)
      throw new CustomError(errorCodes.NOT_FOUND, 'Diagram port not found');
    if (sourcePort.options.in === true)
      throw new CustomError(
        errorCodes.BAD_REQUEST,
        'In port cannot be a source port'
      );
  }

  if (targetPortId) {
    const targetPort = await DiagramPortDao.findOne(targetPortId);
    if (!targetPort)
      throw new CustomError(errorCodes.NOT_FOUND, 'Diagram port not found');
    if (targetPort.options.in === false)
      throw new CustomError(
        errorCodes.BAD_REQUEST,
        'Out port cannot be a target port'
      );
  }

  const diagramLink = await DiagramLinkDao.update(linkCondition, {
    sourcePort: sourcePortId,
    targetPort: targetPortId,
    diagram: diagramId,
    ...rest
  });

  return {
    diagramLink,
    statusCode: diagramLink.createdAt === diagramLink.updatedAt ? 201 : 200
  };
};

const removeLink = async linkCondition => {
  const diagramLink = await DiagramLinkDao.removeOne(linkCondition);

  if (!diagramLink)
    throw new CustomError(errorCodes.NOT_FOUND, 'Diagram link not found');

  return { diagramLink, statusCode: 200 };
};

const removeAllLinks = async (linkIds = []) => {
  const result = await DiagramLinkDao.removeAll({
    _id: { $in: linkIds }
  });

  return result;
};

module.exports = {
  get,
  search,
  create,
  update,
  remove,
  updateElements,
  removeElements,
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