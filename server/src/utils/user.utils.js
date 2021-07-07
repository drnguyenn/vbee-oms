const bcrypt = require('bcrypt');

const compareBcrypt = async (data, hashed) => {
  const isCorrect = await new Promise((resolve, reject) => {
    bcrypt.compare(data, hashed, (err, same) => {
      if (err) reject(err);
      resolve(same);
    });
  });
  return isCorrect;
};

const generateSalt = rounds => bcrypt.genSaltSync(rounds);

const hashBcrypt = (text, salt) => {
  const hashedBcrypt = new Promise((resolve, reject) => {
    bcrypt.hash(text, salt, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });
  return hashedBcrypt;
};

const omitPasswordField = ({ password, ...rest }) => ({ ...rest });

module.exports = { compareBcrypt, generateSalt, hashBcrypt, omitPasswordField };
