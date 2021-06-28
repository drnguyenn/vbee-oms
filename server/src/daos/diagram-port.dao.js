const {
  Types: { ObjectId }
} = require('mongoose');
const DiagramPortModel = require('@models/diagram-port.model');

const create = async data => {
  const diagramPort = await DiagramPortModel.create(data);
  return diagramPort;
};

const findOne = async (condition, projection) => {
  if (ObjectId.isValid(condition)) {
    const diagramPort = await DiagramPortModel.findById(condition, projection);
    return diagramPort;
  }

  if (typeof condition === 'object' && condition) {
    const diagramPort = await DiagramPortModel.findOne(condition, projection);
    return diagramPort;
  }

  return null;
};

const findAll = async (condition, projection) => {
  const diagrams = await DiagramPortModel.find(condition, projection);
  return diagrams;
};

const update = async (condition, data) => {
  const options = {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    omitUndefined: true
  };

  if (ObjectId.isValid(condition)) {
    const diagramPort = await DiagramPortModel.findByIdAndUpdate(
      condition,
      data,
      options
    );
    return diagramPort;
  }

  if (typeof condition === 'object' && condition) {
    const diagramPort = await DiagramPortModel.findOneAndUpdate(
      condition,
      data,
      options
    );
    return diagramPort;
  }

  return null;
};

const removeOne = async condition => {
  if (ObjectId.isValid(condition)) {
    const diagramPort = await DiagramPortModel.findByIdAndDelete(condition);
    return diagramPort;
  }

  if (typeof condition === 'object' && condition) {
    const diagramPort = await DiagramPortModel.findOneAndDelete(condition);
    return diagramPort;
  }

  return null;
};

const removeMany = async condition => {
  const diagramPorts = await DiagramPortModel.deleteMany(condition);
  return diagramPorts;
};

module.exports = { create, findOne, findAll, update, removeOne, removeMany };
