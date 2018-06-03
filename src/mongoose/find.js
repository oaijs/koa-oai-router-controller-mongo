const { buildQuery } = require('../utils/mongo-helper');

function find() {
  const resps = this.arraySchema;
  const params = [{
    name: 'where',
    type: 'string',
    format: 'json',
    in: 'query',
    required: false,
  }, {
    name: 'fields',
    type: 'string',
    format: 'json',
    in: 'query',
    required: false,
  }, {
    name: 'skip',
    type: 'number',
    format: 'int32',
    in: 'query',
    required: false,
    default: 0,
  }, {
    name: 'limit',
    type: 'number',
    format: 'int32',
    in: 'query',
    required: false,
    default: 0,
  }, {
    name: 'sort',
    type: 'string',
    format: 'json',
    in: 'query',
    required: false,
  }, {
    name: 'populate',
    type: 'string',
    format: 'json',
    in: 'query',
    required: false,
  }];

  const handler = this.middlewareWrap(async (model, { query }) => {
    const ret = await buildQuery(model.find(), query, undefined, this.modelStore);

    return ret;
  });

  return this.bundlePath('get', '', `Find ${this.collectionNamePluralize}`, params, resps, handler);
}

module.exports = {
  find,
};
