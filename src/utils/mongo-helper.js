const _ = require('lodash');

const { JsonParse } = require('./json');

function populateHandler(populate, modelStore) {
  if (modelStore && modelStore.get && populate.model && populate.conn) {
    populate.model = modelStore.get(`${populate.conn}.${populate.model}`);

    return populate;
  }

  return populate;
}

function buildQuery(fn, query = {}, params = {}, modelStore) {
  const id = params.id;
  let where = JsonParse(query.where);
  const fields = JsonParse(query.fields);
  const sort = JsonParse(query.sort);
  const populate = JsonParse(query.populate);
  const skip = Number(query.skip) || 0;
  const limit = Number(query.limit) || 0;

  if (id) where = { _id: id };

  if (!_.isEmpty(where) && _.isObject(where)) fn.where(where);

  if (!_.isEmpty(fields) && _.isObject(fields)) fn.select(fields);

  if (!_.isEmpty(sort) && _.isObject(sort)) fn.sort(sort);

  if (skip) fn.skip(skip);

  if (limit) fn.limit(limit);

  if (!_.isEmpty(populate) && _.isArray(populate) && _.isString(populate[0])) {
    fn.populate(populate);
  } else if (!_.isEmpty(populate) && _.isArray(populate) && _.isObject(populate[0])) {
    _.each(populate, (pop) => {
      fn.populate(populateHandler(pop, modelStore));
    });
  } else if (!_.isEmpty(populate) && _.isObject(populate)) {
    fn.populate(populateHandler(populate, modelStore));
  }

  return fn;
}

function buildPageQuery(model, params, pageStart, modelStore) {
  const page = _.toNumber(_.get(params, 'page', 0)) - pageStart;
  const size = _.toNumber(_.get(params, 'size', 10));
  const where = _.get(params, 'where');

  params.page = page;
  params.size = size;
  params.skip = page * size;
  params.limit = size;

  return Promise.props({
    page: page + 1,
    size,
    total: buildQuery(model.count(), { where }, undefined, modelStore),
    list: buildQuery(model.find(), params, undefined, modelStore),
  })
    .then((ret) => {
      return _.merge({}, { pageCount: Math.ceil(ret.total / ret.size) }, ret);
    });
}

function instanceOfMongooseModel(model) {
  return (
    model.modelName &&
    model.db &&
    model.collection);
}

module.exports = {
  buildQuery,
  buildPageQuery,
  instanceOfMongooseModel,
};
