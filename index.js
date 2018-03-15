const mongoose = require('mongoose');
require('mongoose-schema-jsonschema')(mongoose);

const ControllerMongo = require('./src/mongoose');

module.exports = ControllerMongo;
