const {
  Types: { ObjectId }
} = require('mongoose');
const DiagramLinkModel = require('@models/diagram-link.model');

const create = async data => {
  const diagramLink = await DiagramLinkModel.create(data);
  return diagramLink;
};

const findOne = async (condition, projection) => {
  if (ObjectId.isValid(condition)) {
    const diagramLink = await DiagramLinkModel.findById(condition, projection);
    return diagramLink;
  }

  if (typeof condition === 'object' && condition) {
    const diagramLink = await DiagramLinkModel.findOne(condition, projection);
    return diagramLink;
  }

  return null;
};

const findAll = async (condition, projection) => {
  const diagrams = await DiagramLinkModel.find(condition, projection);
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
    const diagramLink = await DiagramLinkModel.findByIdAndUpdate(
      condition,
      data,
      options
    );
    return diagramLink;
  }

  if (typeof condition === 'object' && condition) {
    const diagramLink = await DiagramLinkModel.findOneAndUpdate(
      condition,
      data,
      options
    );
    return diagramLink;
  }

  return null;
};

const removeOne = async condition => {
  if (ObjectId.isValid(condition)) {
    const diagramLink = await DiagramLinkModel.findByIdAndDelete(condition);
    return diagramLink;
  }

  if (typeof condition === 'object' && condition) {
    const diagramLink = await DiagramLinkModel.findOneAndDelete(condition);
    return diagramLink;
  }

  return null;
};

const removeMany = async condition => {
  const diagramLinks = await DiagramLinkModel.deleteMany(condition);
  return diagramLinks;
};

module.exports = { create, findOne, findAll, update, removeOne, removeMany };
