const { omitIsNil } = require('@utils/omit.utils');

const omitReq = (req, res, next) => {
  req.body = omitIsNil(req.body, { deep: true });
  req.headers = omitIsNil(req.headers, { deep: true });
  req.query = omitIsNil(req.query, { deep: true });
  req.params = omitIsNil(req.params, { deep: true });
  next();
};

module.exports = omitReq;
