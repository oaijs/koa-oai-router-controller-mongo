const _ = require('lodash');
const csv = require('csv');
const iconv = require('iconv-lite');

const { JsonParse } = require('../utils/json');
const { buildQuery } = require('../utils/mongo-helper');

function transform(data) {
  return _.mapValues(data, (value) => {
    if (_.isDate(value)) {
      return new Date().toLocaleString();
    }

    return value;
  });
}

function download() {
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
    name: 'alias',
    type: 'string',
    format: 'json',
    in: 'query',
    required: false,
  }, {
    name: 'charset',
    type: 'string',
    in: 'query',
    required: false,
    default: 'utf8',
  }];

  const handler = this.middlewareWrap(async (model, { query }, ctx) => {
    query.fields = _.merge({ _id: 0, __v: 0 }, JsonParse(query.fields));

    const columns = JsonParse(query.alias);

    const ret = await buildQuery(model.find().lean(), query, undefined, this.modelStore)
      .cursor()
      .pipe(csv.transform(transform))
      .pipe(csv.stringify({ header: true, columns: _.isEmpty(columns) ? undefined : columns }))
      .pipe(iconv.decodeStream('utf8'))
      .pipe(iconv.encodeStream(query.charset || 'utf8'));

    ctx.set('Content-Type', 'text/csv');
    ctx.attachment(`${ctx.params.datasource}-${ctx.params.collection}.csv`);

    return ret;
  });

  return this.bundlePath('get', '/download', `Download ${this.collectionNamePluralize}`, params, resps, handler);
}

module.exports = {
  download,
};
