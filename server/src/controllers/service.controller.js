const ServiceService = require('../services/service.service');

const getService = async (req, res) => {
  const { id } = req.params;

  const service = await ServiceService.get(id);

  return res.json({ status: 1, result: { service } });
};

const createService = async (req, res) => {
  const service = await ServiceService.create(req.body);

  return res.status(201).json({ status: 1, result: { service } });
};

const updateService = async (req, res) => {
  const { id } = req.params;

  const { service, statusCode } = await ServiceService.update(id, req.body);

  return res.status(statusCode).json({ status: 1, result: { service } });
};

const deleteService = async (req, res) => {
  const { id } = req.params;

  const service = await ServiceService.removeOne(id);

  return res.json({ status: 1, result: { service } });
};

const searchServices = async (req, res) => {
  const services = await ServiceService.search(req.query);

  return res.json({ status: 1, result: { services } });
};

const addMember = async (req, res) => {
  const { id, userId } = req.params;
  const { role } = req.body;

  const { member, statusCode } = await ServiceService.addMember(id, userId, {
    role
  });

  return res.status(statusCode).json({
    status: statusCode < 400 ? 1 : 0,
    result: { member }
  });
};

const updateMember = async (req, res) => {
  const { id, userId } = req.params;
  const { role } = req.body;

  const { member, statusCode } = await ServiceService.updateMember(id, userId, {
    role
  });

  return res.status(statusCode).json({
    status: statusCode < 400 ? 1 : 0,
    result: { member }
  });
};

const removeMember = async (req, res) => {
  const { id, userId } = req.params;

  const { member, statusCode } = await ServiceService.removeMember(id, userId);

  return res.json({ status: statusCode < 400 ? 1 : 0, result: { member } });
};

const removeMemberFromAllServices = async (req, res) => {
  const { userId } = req.params;

  const { statusCode } = await ServiceService.removeMemberFromAllServices(
    userId
  );

  return res.status(statusCode).json({ status: statusCode < 400 ? 1 : 0 });
};

module.exports = {
  getService,
  searchServices,
  createService,
  updateService,
  deleteService,
  addMember,
  updateMember,
  removeMember,
  removeMemberFromAllServices
};
