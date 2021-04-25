const rawBodySaver = (req, res, buf, encoding) => {
  if (buf && buf.length) req.rawBody = buf.toString(encoding || 'utf8');
};

module.exports = rawBodySaver;
