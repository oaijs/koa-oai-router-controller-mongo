const { buildQuery } = require('../utils/mongo-helper');

function remove() {
  const resps = this.multiUpdateSchema;
  const params = [{
    name: 'where',
    type: 'string',
    format: 'json',
    in: 'query',
    required: true,
  }];

  const handler = this.middlewareWrap(async (model, { query }) => {
    const ret = await buildQuery(model.remove(), query);

    return ret;
  });

  return this.bundlePath('delete', '', `Delete ${this.collectionNamePluralize}`, params, resps, handler);
}

module.exports = {
  remove,
};
