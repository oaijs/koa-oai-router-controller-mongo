function drop() {
  const params = [];
  const resps = this.multiUpdateSchema;

  const handler = this.middlewareWrap(async (model) => {
    const ret = await model.remove({});

    return ret;
  });

  return this.bundlePath('delete', 'drop', `Drop ${this.collectionName} database, dangerous!`, params, resps, handler);
}

module.exports = {
  drop,
};
