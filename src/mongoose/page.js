const { pageQuery } = require('../utils/mongo-helper');

function page() {
  const resps = this.pageSchema;
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
    name: 'page',
    type: 'number',
    format: 'int32',
    in: 'query',
    required: false,
    default: 0,
  }, {
    name: 'size',
    type: 'number',
    format: 'int32',
    in: 'query',
    required: false,
    default: 10,
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
    const ret = await pageQuery(model, query);

    return ret;
  });

  return this.bundlePath('get', 'page', `Page ${this.collectionNamePluralize}`, params, resps, handler);
}

module.exports = {
  page,
};
