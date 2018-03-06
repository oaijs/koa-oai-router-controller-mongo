const _ = require('lodash');

function JsonParse(str) {
  if (_.isPlainObject(str)) {
    return str;
  } else if (_.isString(str)) {
    return JSON.parse(str);
  }

  return {};
}

module.exports = {
  JsonParse,
};
