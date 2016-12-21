'use strict';

var _ = require('lodash');
var tartan = require('tartan');
var syntax = require('../../syntax/weddslist');

/*
 options = {
   errorHandler: <default>,
   processTokens: <default>,
   transformSyntaxTree: <default>
 }
 */

function factory(options) {
  options = _.extend({}, options);

  return tartan.parse([
    tartan.parse.stripe(),
    tartan.parse.literal('('),
    tartan.parse.literal(')'),
    tartan.parse.literal('['),
    tartan.parse.literal(']'),
    tartan.parse.color({
      allowLongNames: true,
      colorPrefix: /[#]/,
      colorSuffix: null,
      colorFormat: 'long',
      allowComment: false
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
        // Disable some token classes
        isWarpAndWeftSeparator: null,
        isPivot: null,
        isBlockStart: null,
        isBlockEnd: null,

        // Add new token classes
        isWarpStart: function(token) {
          return tartan.utils.token.isLiteral(token) && (token.value == '[');
        },
        isWeftStart: function(token) {
          return tartan.utils.token.isLiteral(token) && (token.value == ']');
        },
        isBlockBodyStart: function(token) {
          return tartan.utils.token.isLiteral(token) && (token.value == '(');
        },
        isBlockBodyEnd: function(token) {
          return tartan.utils.token.isLiteral(token) && (token.value == ')');
        }
      }),
      transformSyntaxTree: options.transformSyntaxTree
    })
  });
}

module.exports = factory;
