const { buildQuery } = require('../utils/mongo-helper');

function count() {
  const resps = this.countSchema;
  const params = [{
    name: 'where',
    type: 'string',
    format: 'json',
    in: 'query',
    required: false,
  }];

  const handler = this.middlewareWrap(async (model, { query }) => {
    const ret = await buildQuery(model.count(), query, undefined, this.modelStore);

    return ret;
  });

  return this.bundlePath('get', 'count', `Count ${this.collectionName}`, params, resps, handler);
}

module.exports = {
  count,
};
