function create() {
  const resps = this.arraySchema;
  const params = [{
    in: 'body',
    name: 'data',
    schema: this.arraySchema,
  }];

  const handler = this.middlewareWrap(async (model, { body }) => {
    const ret = await model.insertMany(body);

    return ret;
  });

  return this.bundlePath('post', '', `Create ${this.collectionNamePluralize}`, params, resps, handler);
}

module.exports = {
  create,
};
