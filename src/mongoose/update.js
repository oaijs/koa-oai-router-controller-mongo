const { JsonParse } = require('../utils/json');

function update() {
  const resps = this.multiUpdateSchema;
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
    const data = body;

    const ret = await model.update(where, data, options);

    return ret;
  });

  return this.bundlePath('put', '', `Update ${this.collectionNamePluralize}`, params, resps, handler);
}

module.exports = {
  update,
};
