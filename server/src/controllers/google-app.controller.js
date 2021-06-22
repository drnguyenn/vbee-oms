const path = require('path');

const GoogleAppService = require('@services/google-app.service');

const getAndStoreNewTokens = async (req, res) => {
  const { code } = req.query;

  await GoogleAppService.getAndStoreNewTokens(code);

  return res.sendFile(
    path.join(__dirname, '../assets/templates/google-app-successful-auth.html')
  );
};

module.exports = { getAndStoreNewTokens };
