const { buildQuery } = require('../utils/mongo-helper');

function findById() {
  const resps = this.schema;
  const params = [{
    name: 'id',
    type: 'string',
    in: 'path',
    required: true,
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

  const handler = this.middlewareWrap(async (model, { query, param }) => {
    const ret = await buildQuery(model.findOne(), query, param, this.modelStore);

    return ret;
  });

  return this.bundlePath('get', '/{id}', `Find ${this.collectionName} by id`, params, resps, handler);
}

module.exports = {
  findById,
};
