const { JsonParse } = require('../utils/json');

function findOneAndUpdate() {
  const resps = this.schema;
  const params = [{
    name: 'where',
    type: 'string',
    format: 'json',
    in: 'query',
    required: false,
    description: 'Support all mongo where filter.',
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

  const handler = this.middlewareWrap(async (model, { query, body }) => {
    const where = JsonParse(query.where || '{}');
    const options = JsonParse(query.options || '{"new": true}');
    const update = body;

    const ret = await model.findOneAndUpdate(where, update, options);

    return ret;
  });

  return this.bundlePath('put', 'findOneAndUpdate', `Update ${this.collectionName}`, params, resps, handler);
}

module.exports = {
  findOneAndUpdate,
};
