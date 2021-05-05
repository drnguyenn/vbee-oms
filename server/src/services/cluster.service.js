/* eslint-disable no-console */
const {
  Types: { ObjectId }
} = require('mongoose');

const CustomError = require('@errors/custom-error');
const errorCodes = require('@errors/code');

const ClusterDao = require('@daos/cluster.dao');
const ClusterMemberDao = require('@daos/cluster-member.dao');
const ServiceMemberDao = require('@daos/service-member.dao');
const DiagramDao = require('@daos/diagram.dao');
const DiagramNodeDao = require('@daos/diagram-node.dao');
const DiagramLinkDao = require('@daos/diagram-link.dao');

const UserService = require('./user.service');
const ServiceService = require('./service.service');
const DiagramService = require('./diagram.service');

const get = async (condition, projection) => {
  const cluster = await ClusterDao.findOne(condition, projection);

  if (!cluster)
    throw new CustomError(errorCodes.NOT_FOUND, 'Cluster not found');

  return cluster;
};

const create = async data => {
  if (await ClusterDao.findOne({ name: data.name }))
    throw new CustomError(
      errorCodes.BAD_REQUEST,
      'Cluster name already exists'
    );

  const cluster = await ClusterDao.create(data);

  await DiagramDao.create({ cluster: cluster._id });

  return cluster;
};

const update = async (condition, data) => {
  // Find out whether any cluster has the same name with the name
  // that is requested to be changed to, except the one that matched the condition
  let conditionAndException;

  if (ObjectId.isValid(condition))
    conditionAndException = {
      name: data.name,
      $and: [{ _id: { $ne: condition } }]
    };
  else if (typeof condition === 'object' && condition) {
    const conditionAvailableKeys = ['id', 'name'];

    Object.keys(condition).forEach(key => {
      if (!conditionAvailableKeys.includes(key))
        throw new CustomError(
          errorCodes.BAD_REQUEST,
          'Invalid cluster condition'
        );
    });

    conditionAndException = {
      name: data.name,
      $and: [
        Object.keys(condition).reduce(
          (accumulator, currentValue) => ({
            ...accumulator,
            [currentValue]: { $ne: condition[currentValue] }
          }),
          {}
        )
      ]
    };
  } else
    throw new CustomError(errorCodes.BAD_REQUEST, 'Invalid cluster condition');

  if (await ClusterDao.findOne(conditionAndException))
    throw new CustomError(
      errorCodes.BAD_REQUEST,
      'Cluster name already exists'
    );

  const cluster = await ClusterDao.update(condition, data);

  await DiagramDao.update({ cluster: cluster._id }, {});

  return {
    statusCode: cluster.createdAt === cluster.updatedAt ? 201 : 200,
    cluster
  };
};

const remove = async condition => {
  const cluster = await ClusterDao.remove(condition);

  if (!cluster)
    throw new CustomError(errorCodes.NOT_FOUND, 'Cluster not found');

  const { _id, services } = cluster;

  await ClusterMemberDao.removeAll({ cluster: _id });

  if (services.length) await ServiceService.removeAll(services);

  await DiagramService.remove({ cluster: _id });

  return cluster;
};

const search = async (condition, projection = { name: 1, description: 1 }) => {
  if (condition.q) {
    const clusters = await ClusterDao.search(condition.q, projection);
    return clusters;
  }

  const clusters = await ClusterDao.findAll(condition, projection);
  return clusters;
};

const addMember = async (clusterCondition, memberCondition, data) => {
  const cluster = await get(clusterCondition);

  const user = await UserService.get(memberCondition);

  if (await ClusterMemberDao.findOne({ user: user._id, cluster: cluster._id }))
    throw new CustomError(errorCodes.BAD_REQUEST, 'Member is already added');

  const member = await ClusterMemberDao.create({
    user: user._id,
    cluster: cluster._id,
    data
  });

  return { member, statusCode: 201 };
};

const updateMember = async (clusterCondition, memberCondition, data) => {
  const cluster = await get(clusterCondition);

  const user = await UserService.get(memberCondition);

  const member = await ClusterMemberDao.update(
    { user: user._id, cluster: cluster._id },
    data
  );

  return {
    member,
    statusCode: member.createdAt === member.updatedAt ? 201 : 200
  };
};

const removeMember = async (clusterCondition, memberCondition) => {
  const cluster = await get(clusterCondition);

  const user = await UserService.get(memberCondition);

  const member = await ClusterMemberDao.removeOne({
    user: user._id,
    cluster: cluster._id
  });

  if (!member) throw new CustomError(errorCodes.NOT_FOUND, 'Member not found');

  await ServiceMemberDao.removeAll({
    service: {
      $in: cluster.services.map(service => service._id)
    }
  });

  return { member, statusCode: 200 };
};

const removeMemberFromAllClusters = async memberCondition => {
  const user = await UserService.get(memberCondition);

  await ClusterMemberDao.removeAll({ user: user._id });

  return { statusCode: 200 };
};

const getDiagram = async clusterCondition => {
  const cluster = await get(clusterCondition);

  await cluster.populate('diagram').execPopulate();

  return cluster.diagram;
};

const addDiagramNode = async (clusterCondition, { serviceId, ...rest }) => {
  const cluster = await get(clusterCondition);

  if (serviceId) await ServiceService.get(serviceId);

  const diagram = await DiagramDao.findOne({ cluster: cluster._id });

  const diagramNode = await DiagramNodeDao.create({
    diagram: diagram._id,
    service: serviceId,
    ...rest
  });

  return { diagramNode, statusCode: 201 };
};

const updateDiagramNode = async (
  clusterCondition,
  nodeCondition,
  { serviceId, ...rest }
) => {
  const cluster = await get(clusterCondition);

  if (serviceId) await ServiceService.get(serviceId);

  const diagram = await DiagramDao.findOne({ cluster: cluster._id });

  const diagramNode = await DiagramNodeDao.update(nodeCondition, {
    diagram: diagram._id,
    service: serviceId,
    ...rest
  });

  return {
    diagramNode,
    statusCode: diagramNode.createdAt === diagramNode.updatedAt ? 201 : 200
  };
};

const removeDiagramNode = async (clusterCondition, nodeCondition) => {
  await get(clusterCondition);

  const diagramNode = await DiagramNodeDao.remove(nodeCondition);

  if (!diagramNode)
    throw new CustomError(errorCodes.NOT_FOUND, 'Diagram node not found');

  return { diagramNode, statusCode: 200 };
};

const addDiagramLink = async (clusterCondition, data) => {
  const cluster = await get(clusterCondition);

  const diagram = await DiagramDao.findOne({ cluster: cluster._id });

  const diagramLink = await DiagramLinkDao.create({
    ...data,
    diagram: diagram._id
  });

  return { diagramLink, statusCode: 201 };
};

const updateDiagramLink = async (clusterCondition, linkCondition, data) => {
  const cluster = await get(clusterCondition);

  const diagram = await DiagramDao.findOne({ cluster: cluster._id });

  const diagramLink = await DiagramLinkDao.update(linkCondition, {
    ...data,
    diagram: diagram._id
  });

  return {
    diagramLink,
    statusCode: diagramLink.createdAt === diagramLink.updatedAt ? 201 : 200
  };
};

const removeDiagramLink = async (clusterCondition, linkCondition) => {
  await get(clusterCondition);

  const diagramLink = await DiagramLinkDao.remove(linkCondition);

  if (!diagramLink)
    throw new CustomError(errorCodes.NOT_FOUND, 'Diagram link not found');

  return { diagramLink, statusCode: 200 };
};

module.exports = {
  get,
  search,
  create,
  update,
  remove,
  addMember,
  updateMember,
  removeMember,
  removeMemberFromAllClusters,
  getDiagram,
  addDiagramNode,
  updateDiagramNode,
  removeDiagramNode,
  addDiagramLink,
  updateDiagramLink,
  removeDiagramLink
};
