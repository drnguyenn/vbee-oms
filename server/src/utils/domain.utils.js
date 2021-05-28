const sslChecker = require('ssl-checker');

const checkDomainsSslStatus = async (domains = []) => {
  const results = await Promise.all(domains.map(domain => sslChecker(domain)));

  return results.map((result, index) => ({
    value: domains[index],
    ...result
  }));
};

module.exports = { checkDomainsSslStatus };
