const parseBoolean = value => value > '' && value !== 'false' && value !== '0';

module.exports = { parseBoolean };
