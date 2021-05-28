const {
  Types: { ObjectId }
} = require('mongoose');
const DiagramNodeModel = require('@models/diagram-node.model');

const create = async data => {
  const diagramNode = await DiagramNodeModel.create(data);
  return diagramNode;
};

const findOne = async (condition, projection) => {
  if (ObjectId.isValid(condition)) {
    const diagramNode = await DiagramNodeModel.findById(condition, projection);
    return diagramNode;
  }

  if (typeof condition === 'object' && condition) {
    const diagramNode = await DiagramNodeModel.findOne(condition, projection);
    return diagramNode;
  }

  return null;
};

const findAll = async (condition, projection) => {
  const diagrams = await DiagramNodeModel.find(condition, projection);
  return diagrams;
};

const update = async (condition, data) => {
  const options = {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true
  };

  if (ObjectId.isValid(condition)) {
    const diagramNode = await DiagramNodeModel.findByIdAndUpdate(
      condition,
      data,
      options
    );
    return diagramNode;
  }

  if (typeof condition === 'object' && condition) {
    const diagramNode = await DiagramNodeModel.findOneAndUpdate(
      condition,
      data,
      options
    );
    return diagramNode;
  }

  return null;
};

const removeOne = async condition => {
  if (ObjectId.isValid(condition)) {
    const diagramNode = await DiagramNodeModel.findByIdAndDelete(condition);
    return diagramNode;
  }

  if (typeof condition === 'object' && condition) {
    const diagramNode = await DiagramNodeModel.findOneAndDelete(condition);
    return diagramNode;
  }

  return null;
};

const removeAll = async condition => {
  const diagramNodes = await DiagramNodeModel.deleteMany(condition);
  return diagramNodes;
};

module.exports = { create, findOne, findAll, update, removeOne, removeAll };
