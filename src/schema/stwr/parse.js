'use strict';

var _ = require('lodash');
var index = require('./index');
var tartan = require('tartan');

/*
  options = {
    warpAndWeftSeparator: index.warpAndWeftSeparator
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
    tartan.parse.literal(options.warpAndWeftSeparator),
    tartan.parse.color({
      allowLongNames: true,
      colorPrefix: /[=][#]?/,
      colorSuffix: null,
      colorFormat: 'long',
      allowComment: true,
      commentSuffix: /;/,
      requireCommentSuffix: true,
      commentFormat: /^\s*(.*)\s*;\s*$/
    })
  ], {
    errorHandler: options.errorHandler,
    processTokens: tartan.filter([
      options.processTokens,
      tartan.filter.removeTokens(tartan.defaults.insignificantTokens)
    ]),
    buildSyntaxTree: tartan.syntax.classic({
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
