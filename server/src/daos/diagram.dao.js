const {
  Types: { ObjectId }
} = require('mongoose');
const DiagramModel = require('@models/diagram.model');

const create = async data => {
  const diagram = await DiagramModel.create(data);
  return diagram;
};

const findOne = async (condition, projection) => {
  if (ObjectId.isValid(condition)) {
    const diagram = await DiagramModel.findById(condition, projection);
    return diagram;
  }

  if (typeof condition === 'object' && condition) {
    const diagram = await DiagramModel.findOne(condition, projection);
    return diagram;
  }

  return null;
};

const findAll = async (condition, projection) => {
  const diagrams = await DiagramModel.find(condition, projection);
  return diagrams;
};

const search = async (query, projection = {}) => {
  const diagrams = await DiagramModel.find(
    { $text: { $search: query } },
    { score: { $meta: 'textScore' }, ...projection }
  ).sort({ score: { $meta: 'textScore' } });
  return diagrams;
};

const update = async (condition, data) => {
  const options = {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true
  };

  if (ObjectId.isValid(condition)) {
    const diagram = await DiagramModel.findByIdAndUpdate(
      condition,
      data,
      options
    );
    return diagram;
  }

  if (typeof condition === 'object' && condition) {
    const diagram = await DiagramModel.findOneAndUpdate(
      condition,
      data,
      options
    );
    return diagram;
  }

  return null;
};

const remove = async condition => {
  if (ObjectId.isValid(condition)) {
    const diagram = await DiagramModel.findByIdAndDelete(condition);
    return diagram;
  }

  if (typeof condition === 'object' && condition) {
    const diagram = await DiagramModel.findOneAndDelete(condition);
    return diagram;
  }

  return null;
};

module.exports = { create, findOne, findAll, search, update, remove };
