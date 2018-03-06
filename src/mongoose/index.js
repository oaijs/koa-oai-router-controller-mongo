const _ = require('lodash');
const pluralize = require('pluralize');

const {
  countSchema,
  multiUpdateSchema,
  toJsonSchema,
  toUpdateSchema,
  toArraySchema,
  toPageSchema,
  toHttpResponseSchema,
} = require('../utils/schema');
const { instanceOfMongooseModel } = require('../utils/mongo-helper');
const { urlJoin } = require('../utils/route');

class ControllerMongo {
  constructor(opts = {}) {
    const {
      datasourceName,
      collectionName,
      beforeBundle = (info) => { return info; },
      reply,
      model,
    } = opts;

    this.datasourceName = datasourceName;
    this.collectionName = collectionName;
    this.collectionNamePluralize = pluralize(this.collectionName);
    this.beforeBundle = beforeBundle;
    this.reply = reply;
    this.model = model;

    this.schema = instanceOfMongooseModel(model) ? toJsonSchema(this.model) : { type: 'object' };
    this.updateSchema = toUpdateSchema(this.schema);
    this.arraySchema = toArraySchema(this.schema);
    this.pageSchema = toPageSchema(this.schema);
    this.countSchema = countSchema;
    this.multiUpdateSchema = multiUpdateSchema;
  }

  bundlePaths() {
    const paths = {};

    [
      'create',
      'find',
      'page',
      'count',
      'drop',
      'remove',
      'update',
      'findOne',
      'findOneAndUpdate',
      'removeById',
      'findById',
      'findOneAndUpdateById',
    ].forEach((funName) => {
      if (_.isFunction(this[funName])) {
        _.merge(paths, this[funName]());
      }
    });

    return paths;
  }

  bundlePath(method, suffix, summary, parameters, responses, handler) {
    const endpoint = urlJoin(this.datasourceName, this.collectionName, suffix);

    const desc = this.beforeBundle({
      summary,
      tags: [`${this.datasourceName}.${this.collectionName}`],
      'x-oai-controller': [{
        handler,
      }],
      parameters,
      responses: { default: toHttpResponseSchema(responses) },
    });

    return _.set({}, `${endpoint}.${method}`, desc);
  }

  middlewareWrap(handler) {
    const self = this;

    return async (ctx, next) => {
      const model = instanceOfMongooseModel(self.model) ? self.model : self.model(ctx);

      try {
        const data = {
          param: ctx.params,
          query: ctx.request.query,
          body: ctx.request.body,
        };

        const ret = await handler(model, data);

        self.reply(ctx, next, null, ret);
      } catch (error) {
        self.reply(ctx, next, error);
      }
    };
  }

  mixin(obj) {
    _.each(obj, (value, key) => {
      if (this[key]) {
        throw new Error(`Don't allow override existed prototype method. method: ${key}`);
      }

      ControllerMongo.prototype[key] = value;
    });
  }
}

ControllerMongo.prototype.mixin(require('./count'));
ControllerMongo.prototype.mixin(require('./create'));
ControllerMongo.prototype.mixin(require('./drop'));
ControllerMongo.prototype.mixin(require('./find'));
ControllerMongo.prototype.mixin(require('./findById'));
ControllerMongo.prototype.mixin(require('./findOne'));
ControllerMongo.prototype.mixin(require('./findOneAndUpdate'));
ControllerMongo.prototype.mixin(require('./findOneAndUpdateById'));
ControllerMongo.prototype.mixin(require('./page'));
ControllerMongo.prototype.mixin(require('./remove'));
ControllerMongo.prototype.mixin(require('./removeById'));
ControllerMongo.prototype.mixin(require('./update'));

module.exports = ControllerMongo;