const mung = require('express-mung');
const snakecaseKeys = require('snakecase-keys');

const sortObject = obj =>
  Object.keys(obj)
    .sort()
    .reduce((result, key) => {
      result[key] = obj[key];
      return result;
    }, {});

const transformObjectId = obj => {
  if (typeof obj !== 'object') {
    return obj;
  }

  // typeof null = object
  if (obj === null) {
    return null;
  }

  // Check if obj is Mongoose Object
  if (obj._doc) {
    return transformObjectId(obj.toJSON());
  }

  // Check if obj is ObjectId
  if (obj._bsontype === 'ObjectID') {
    return obj.toString();
  }

  Object.keys(obj).forEach(key => {
    // eslint-disable-next-line no-param-reassign
    obj[key] = transformObjectId(obj[key]);
  });

  if (Array.isArray(obj)) return obj;
  if (Object.prototype.toString.call(obj) === '[object Date]') return obj;

  return sortObject(obj);
};

const snakecaseRes = () =>
  mung.json(body =>
    snakecaseKeys(transformObjectId(body), {
      deep: true
    })
  );

module.exports = snakecaseRes;
