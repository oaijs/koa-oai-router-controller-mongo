const { buildQuery } = require('../utils/mongo-helper');

function findOne() {
  const resps = this.schema;
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
    name: 'populate',
    type: 'string',
    format: 'json',
    in: 'query',
    required: false,
  }];

  const handler = this.middlewareWrap(async (model, { query }) => {
    const ret = await buildQuery(model.findOne(), query, undefined, this.modelStore);

    return ret;
  });

  return this.bundlePath('get', 'findOne', `Find ${this.collectionName}`, params, resps, handler);
}

module.exports = {
  findOne,
};
