'use strict';

var tartan = require('tartan');

module.exports.id = 'extended';
module.exports.name = 'Extended syntax';
module.exports.parse = require('./parse');
module.exports.format = require('./format');
module.exports.colors = tartan.defaults.colors;
module.exports.warpAndWeftSeparator = tartan.defaults.warpAndWeftSeparator;
