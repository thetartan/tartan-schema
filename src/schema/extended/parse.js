'use strict';

var _ = require('lodash');
var index = require('./index');
var tartan = require('tartan');
var syntax = require('../../syntax/extended');

/*
  options = {
    warpAndWeftSeparator: index.warpAndWeftSeparator,
    errorHandler: <default>,
    processTokens: <default>,
    transformSyntaxTree: <default>
  }
*/

function factory(options) {
  options = _.extend({}, options);

  if (!_.isString(options.warpAndWeftSeparator)) {
    options.warpAndWeftSeparator = '';
  }
  if (options.warpAndWeftSeparator == '') {
    options.warpAndWeftSeparator = index.warpAndWeftSeparator;
  }

  return tartan.parse([
    tartan.parse.pivot(),
    tartan.parse.stripe(),
    tartan.parse.literal('['),
    tartan.parse.literal(']'),
    tartan.parse.literal('('),
    tartan.parse.literal(')'),
    tartan.parse.literal(options.warpAndWeftSeparator),
    tartan.parse.repeat({
      allowAsPrefix: true,
      allowAsSuffix: true
    }),
    tartan.parse.color({
      allowLongNames: true,
      colorPrefix: /[=]?[#]/,
      colorSuffix: null,
      colorFormat: 'both',
      allowComment: true,
      commentSuffix: /;/,
      requireCommentSuffix: false,
      commentFormat: /^\s*(.*)\s*;\s*$/
    })
  ], {
    errorHandler: options.errorHandler,
    processTokens: tartan.filter([
      options.processTokens,
      tartan.filter.removeTokens(tartan.defaults.insignificantTokens)
    ]),
    buildSyntaxTree: syntax({
      errorHandler: options.errorHandler,
      processTokens: tartan.filter.classify({
        isWarpAndWeftSeparator: function(token) {
          return tartan.utils.token.isLiteral(token) &&
            (token.value == options.warpAndWeftSeparator);
        }
      }),
      transformSyntaxTree: options.transformSyntaxTree
    })
  });
}

module.exports = factory;
