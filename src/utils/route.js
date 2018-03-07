const _ = require('lodash');
const urlJoin_ = require('url-join');

/**
 * Ensure string have prefix.
 * @param {string} str
 * @param {string} prefix
 */
function ensurePrefix(str, prefix) {
  if (_.startsWith(str, prefix)) {
    return str;
  }

  return `${prefix}${str}`;
}

/**
 * Join all segments to a url.
 * @param {[string]} args url segment
 * @returns {string}      url string
 */
function urlJoin(...args) {
  let urlArray = _.pull(args, '/', undefined, null, '');
  if (_.isEmpty(urlArray)) {
    urlArray = ['/'];
  }

  return ensurePrefix(urlJoin_(...urlArray), '/');
}

module.exports = {
  urlJoin,
};
