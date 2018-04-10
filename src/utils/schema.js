const _ = require('lodash');
const mongoseSchema2JsonSchema = require('mongoose2jsonschema');

const countSchema = {
  title: 'countSchema',
  type: 'object',
  properties: {
    count: {
      type: 'number',
      format: 'int32',
    },
  },
};

const multiUpdateSchema = {
  title: 'multiUpdateSchema',
  type: 'object',
  properties: {
    ok: {
      type: 'number',
      format: 'int32',
    },
    nModified: {
      type: 'number',
      format: 'int32',
    },
    n: {
      type: 'number',
      format: 'int32',
    },
  },
};

function toJsonSchema(model) {
  const schema = mongoseSchema2JsonSchema(model.schema);
  schema.properties = _.omit(schema.properties, ['_id', '__v']);

  return schema;
}

function toUpdateSchema(schema) {
  const _schema = _.cloneDeep(schema);
  delete _schema.required;
  _schema.minProperties = 1;

  return _schema;
}

function toArraySchema(schema) {
  return {
    type: 'array',
    items: schema,
  };
}

function toPageSchema(schema) {
  return {
    type: 'object',
    required: ['items'],
    properties: {
      pageCount: {
        type: 'number',
        description: 'total page count.',
      },
      page: {
        type: 'number',
        description: 'current page index.',
      },
      size: {
        type: 'number',
        description: 'page size count.',
      },
      total: {
        type: 'number',
        description: 'total items count.',
      },
      items: {
        type: 'array',
        items: schema,
      },
    },
  };
}

function toHttpResponseSchema(data) {
  return {
    description: 'Http response schema',
    schema: {
      title: 'Http response schema',
      type: 'object',
      required: ['errcode', 'errmsg'],
      properties: {
        errcode: {
          type: 'integer',
          format: 'int32',
        },
        errmsg: {
          type: 'string',
        },
        data,
      },
    },
  };
}


module.exports = {
  countSchema,
  multiUpdateSchema,
  toJsonSchema,
  toUpdateSchema,
  toArraySchema,
  toPageSchema,
  toHttpResponseSchema,
};
