const mongoose = require('mongoose');

const clients = {};

async function mongoFactory(clientName, uri, opts = {}) {
  const old = clients[clientName];
  if (old) {
    console.info(`MONGO:${clientName} created already, use old.`);
    return old;
  }

  const client = mongoose.createConnection(uri, { poolSize: 5, ...opts });

  client.on('connected', () => {
    console.info(`MONGO:${uri} connected`);
  });

  client.on('disconnected', () => {
    console.warn(`MONGO:${uri} disconnected`);
  });

  client.on('connecting', () => {
    console.info(`MONGO:${uri} connecting`);
  });

  client.on('disconnecting', () => {
    console.warn(`MONGO:${uri} disconnecting`);
  });

  client.on('error', (error) => {
    console.error(`MONGO:${uri} error`, error);
  });

  await new Promise((resolve, reject) => {
    client.once('connected', resolve);
    client.once('error', reject);
  });

  clients[clientName] = client;

  return client;
}

module.exports = {
  clients,
  mongoFactory,
};
