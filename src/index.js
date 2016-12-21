'use strict';

var _ = require('lodash');
var tartan = require('tartan');

_.extend(module.exports, require('./@package'));

module.exports.syntax = require('./syntax');
module.exports.schema = require('./schema');

_.extend(tartan.syntax, module.exports.syntax);
_.extend(tartan.schema, module.exports.schema);
