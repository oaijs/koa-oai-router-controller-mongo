const { JsonParse } = require('../utils/json');

function findOneAndUpdateById() {
  const resps = this.schema;
  const params = [{
    name: 'id',
    type: 'string',
    in: 'path',
    required: true,
  }, {
    name: 'options',
    type: 'string',
    in: 'query',
    required: false,
    description: 'Support mongoose options',
  }, {
    name: 'update',
    in: 'body',
    required: true,
    schema: this.updateSchema,
    description: 'More then one filed should be input.',
  }];

  const handler = this.middlewareWrap(async (model, { param, query, body }) => {
    const id = param.id;
    const where = { _id: id };
    const options = JsonParse(query.options || '{"new": true}');
    const update = body;

    const ret = await model.findOneAndUpdate(where, update, options);

    return ret;
  });

  return this.bundlePath('put', '/{id}', `Update ${this.collectionName} by id`, params, resps, handler);
}

module.exports = {
  findOneAndUpdateById,
};
