const DomainService = require('@services/domain.service');

const getDomain = async (req, res) => {
  const { id } = req.params;

  const domain = await DomainService.get(id);

  return res.json({ status: 1, result: { domain } });
};

const createDomains = async (req, res) => {
  const domains = await DomainService.create(req.body);

  return res.status(201).json({ status: 1, result: { domains } });
};

const updateDomain = async (req, res) => {
  const { id } = req.params;

  const { domain, statusCode } = await DomainService.update(id, req.body);

  return res.status(statusCode).json({ status: 1, result: { domain } });
};

const deleteDomain = async (req, res) => {
  const { id } = req.params;

  const domain = await DomainService.removeOne(id);

  return res.json({ status: 1, result: { domain } });
};

const searchDomains = async (req, res) => {
  const domains = await DomainService.search(req.query);

  return res.json({ status: 1, result: { domains } });
};

const getSslStatus = async (req, res) => {
  const domains = await DomainService.getSslStatus(req.query.domains);

  return res.json({ status: 1, result: { domains } });
};

module.exports = {
  getDomain,
  searchDomains,
  createDomains,
  updateDomain,
  deleteDomain,
  getSslStatus
};
