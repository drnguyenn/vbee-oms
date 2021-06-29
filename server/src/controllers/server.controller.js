const ServerService = require('@services/server.service');

const getServer = async (req, res) => {
  const { id } = req.params;

  const server = await ServerService.get(id);

  return res.json({ status: 1, result: { server } });
};

const createServer = async (req, res) => {
  const server = await ServerService.create(req.body);

  return res.status(201).json({ status: 1, result: { server } });
};

const updateServer = async (req, res) => {
  const { id } = req.params;

  const { server, statusCode } = await ServerService.update(id, req.body);

  return res.status(statusCode).json({ status: 1, result: { server } });
};

const deleteServer = async (req, res) => {
  const { id } = req.params;

  const server = await ServerService.removeOne(id);

  return res.json({ status: 1, result: { server } });
};

const searchServers = async (req, res) => {
  const servers = await ServerService.search(req.query);

  return res.json({ status: 1, result: { servers } });
};

const getAllServerDomainsSslStatus = async (req, res) => {
  const { id } = req.params;

  const server = await ServerService.getAllServerDomainsSslStatus(id);

  return res.json({ status: 1, result: { server } });
};

const getMetrics = async (req, res) => {
  const { ids } = req.query;

  const results = await ServerService.getMetrics(ids);

  return res.json({ status: 1, result: { ...results } });
};

module.exports = {
  getServer,
  searchServers,
  createServer,
  updateServer,
  deleteServer,
  getAllServerDomainsSslStatus,
  getMetrics
};
