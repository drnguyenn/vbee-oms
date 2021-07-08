const checkServerHealth = async (req, res) => {
  return res.json({ status: 1 });
};

module.exports = { checkServerHealth };
