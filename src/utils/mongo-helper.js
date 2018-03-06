const _ = require('lodash');

const { JsonParse } = require('./json');

function buildQuery(fn, query = {}, params = {}) {
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

  if (!_.isEmpty(populate) && _.isObject(populate)) fn.populate(populate);

  return fn;
}

function buildPageQuery(model, params) {
  const page = _.toNumber(_.get(params, 'page', 0));
  const size = _.toNumber(_.get(params, 'size', 10));
  const where = _.get(params, 'where');

  params.page = page;
  params.size = size;
  params.skip = page * size;
  params.limit = size;

  return Promise.props({
    page,
    size,
    total: buildQuery(model.count(), { where }),
    list: buildQuery(model.find(), params),
  })
    .then((ret) => {
      return {
        pageCount: Math.ceil(ret.total / ret.size),
        ...ret,
      };
    });
}

function instanceOfMongooseModel(model) {
  return (
    model.modelName &&
    model.db &&
    model.collection);
}

export {
  buildQuery,
  buildPageQuery,
  instanceOfMongooseModel,
};
