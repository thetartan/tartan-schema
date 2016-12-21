'use strict';

var _ = require('lodash');
var index = require('./index');
var tartan = require('tartan');

var defaultOptions = {
  format: {
    color: function(item) {
      var comment = item.comment != '' ? ' ' + item.comment : '';
      return item.name + item.value + comment + ';';
    },
    stripe: function(item) {
      return item.name + item.count;
    },
    block: function(block) {
      var result = _.chain(block.formattedItems).join(' ').trim().value();
      if (result == '') {
        return '';
      }
      var multiply = block.repeat > 1 ? '*' + block.repeat : '';
      if (block.isRoot) {
        result = block.reflect ? '[' + result + ']' : result;
      } else {
        result = block.reflect ? '[' + result + ']' : '(' + result + ')';
      }
      return result + multiply;
    }
  }
};

// Options same as for tartan.render.format():
// + warpAndWeftSeparator: index.warpAndWeftSeparator
// - format
// - join
function factory(options) {
  options = _.extend({}, options, defaultOptions);

  if (!_.isString(options.warpAndWeftSeparator)) {
    options.warpAndWeftSeparator = '';
  }
  if (options.warpAndWeftSeparator == '') {
    options.warpAndWeftSeparator = index.warpAndWeftSeparator;
  }

  options.transformSyntaxTree = tartan.transform([
    options.transformSyntaxTree,
    tartan.transform.fold({
      allowRootReorder: false,
      allowNestedBlocks: false,
      maxFoldLevels: 2,
      minBlockSize: 3,
      greedy: false,
      allowSplitStripe: false,
      processExistingBlocks: false
    })
  ]);

  options.join = function(components) {
    var parts = [];
    if (components.colors.length > 0) {
      parts.push(components.colors.join(' '));
    }
    if (components.warp != components.weft) {
      parts.push(components.warp + ' ' + options.warpAndWeftSeparator +
        ' ' + components.weft);
    } else {
      parts.push(components.warp);
    }
    return parts.join('\n');
  };

  return tartan.render.format(options);
}

module.exports = factory;
