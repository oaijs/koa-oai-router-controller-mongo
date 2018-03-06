const { buildQuery } = require('../utils/mongo-helper');

function removeById() {
  const resps = this.multiUpdateSchema;
  const params = [{
    name: 'id',
    type: 'string',
    in: 'path',
    required: true,
  }];

  const handler = this.middlewareWrap(async (model, { param, query }) => {
    const ret = await buildQuery(model.remove(), query, param);

    return ret;
  });

  return this.bundlePath('delete', '/{id}', `Delete ${this.collectionName} by id`, params, resps, handler);
}

module.exports = {
  removeById,
};
