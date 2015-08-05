var beautify = require('js-beautify').js_beautify;

var SolBuilder = (function() {

    var types = {
        ATTRIBUTE: 'attribute',
        STRUCT:    'struct'   ,
        MAPPING:   'mapping'  ,
        FUNCTION:  'function'
    }

    var properties = {};
    var common                  = ['name', 'comment', 'lineBreak'];
    properties[types.ATTRIBUTE] = ['type', 'modifier', 'value'].concat(common);
    properties[types.STRUCT]    = ['attributes'].concat(common);
    properties[types.MAPPING]   = ['keyType', 'valueType', 'modifier'].concat(common);
    properties[types.FUNCTION]  = ['parameters', 'returnType'].concat(common);

    var inherits = '';
    var name = 'Undefined';
    var replacements = {};

    var items = [];

    function _build(item) {

        if (item.itemType == types.ATTRIBUTE) {
            return _buildAttribute(item);
        } 
        else if (item.itemType == types.STRUCT) {
            return _buildStruct(item);
        } 
        else if (item.itemType == types.MAPPING) {
            return _buildMapping(item);
        } 
        else if (item.itemType == types.FUNCTION) {
            return _buildFunction(item);
        } 
        else {
            throw ('Unknown itemType: ' + item.itemType);
        }
    }

    function _buildComment(item) {
        var result = '';
        if (item.comment && item.comment.length > 0) {
            result += '// ' + item.comment + '\n';
        }
        return result;
    }

    function _lineBreak(item, result) {
        return result + ((item.lineBreak) ? '\n\n' : '\n');
    }

    function _buildAttribute(item) {
        var result = _buildComment(item);
        result += item.type + ' ';
        if (item.modifier && item.modifier.length > 0) {
            result += item.modifier + ' ';
        }
        result += item.name;
        if (item.value && item.value.length > 0) {
            result += ' = ' + item.value;
        }
        result += ';';
        return _lineBreak(item, result);
    }

    function _buildStruct(item) {
        var result = _buildComment(item);
        result += 'struct ' + item.name + ' {\n';
        for (var i = 0; i < item.attributes.length; i++) {
            result += _buildAttribute(item.attributes[i]);
        }
        result += '}';
        return _lineBreak(item, result);
    }

    function _buildMapping(item) {
        var result = _buildComment(item);
        result += 'mapping (' + item.keyType + ' => ' + item.valueType + ') ';
        if (item.modifier) {
            result += item.modifier + ' ';
        }
        result += item.name + ';';
        return _lineBreak(item, result);
    }

    function _buildFunction(item) {
        var result = _buildComment(item);
        result += 'function ' + item.name + '(';
        for (var i = 0; i < item.parameters.length; i++) {
            result += item.parameters[i].type + ' ' + 
                      item.parameters[i].name;
            if (i+1 < item.parameters.length) {
                result += ', ';
            }
        }
        result += ')';
        if (item.modifier) {
            result += ' ' + item.modifier;
        }
        if (item.returnType) {
            result += ' returns (' + item.returnType + ')';
        }
        result += ' {';
        result += item.body;
        result += '}';
        return _lineBreak(item, result);
    }

    function _remove(_name, _type) {
        var index = 0;
        // TODO: create a index of names to optimize.
        for (var i = 0; i < items.length; i++) {
            if (items[i].itemType == _type) {
                if (items[i].name == _name) {
                    items.splice(index, 1);
                    return;
                }
            }
            index++;
        }
    }

    function _change(_type, _tochange) {
        // TODO: create a index of names to optimize.
        for (var i = 0; i < items.length; i++) {
            if (items[i].itemType == _type && items[i].name == _tochange.name) {
                for (var j = 0; j < properties[_type].length; j++) {
                    var property = properties[_type][j];
                    if (_tochange.hasOwnProperty(property)) {
                        items[i][property] = _tochange[property];
                    }
                }
                return;
            }
        }
    }
        
    return {

        setName: function(_name) {
            name = _name;
        },

        getName: function() {
            return name;
        },

        is: function(_parent) {
            inherits = _parent;
        },

        addAttribute: function(attribute) {
            items.push({
                itemType: types.ATTRIBUTE,
                name: attribute.name,
                type: attribute.type,
                modifier: attribute.modifier,
                value: attribute.value,
                comment: attribute.comment,
                lineBreak: attribute.lineBreak
            });
        },

        changeAttribute: function(_tochange) {
            _change(types.ATTRIBUTE, _tochange);
        },

        removeAttribute: function(_name) {
            _remove(_name, types.ATTRIBUTE);
        },

        addMapping: function(mapping) {
            items.push({
                itemType: types.MAPPING,
                keyType: mapping.keyType,
                valueType: mapping.valueType,
                name: mapping.name,
                modifier: mapping.modifier,
                comment: mapping.comment,
                lineBreak: mapping.lineBreak
            });
        },

        changeMapping: function(_tochange) {
            _change(types.MAPPING, _tochange);
        },

        removeMapping: function(_name) {
            _remove(_name, types.MAPPING);
        },

        addStruct: function(struct) {
            items.push({
                itemType: types.STRUCT,
                name: struct.name,
                attributes: struct.attributes,
                comment: struct.comment,
                lineBreak: struct.lineBreak
            });
        },

        changeStruct: function(_tochange) {
            _change(types.STRUCT, _tochange);
        },

        removeStruct: function(_name) {
            _remove(_name, types.STRUCT);
        },

        addFunction: function(func) {
            items.push({
                itemType: types.FUNCTION,
                name: func.name,
                parameters: func.parameters,
                returnType: func.returnType,
                body: func.body,
                comment: func.comment,
                lineBreak: func.lineBreak
            });
        },

        changeFunction: function(_tochange) {
            _change(types.FUNCTION, _tochange);
        },

        removeFunction: function(_name) {
            _remove(_name, types.FUNCTION);
        },

        addReplacement: function(replacement) {
            replacements[replacement.from] = replacement.to;
        },

        getContract: function() {
            var result = 'contract ' + name;
            if (inherits.length > 0) {
                result += ' is ' + inherits;
            }
            result += ' {\n\n';
            for (var i = 0; i < items.length; i++) {
                result += _build(items[i]);
            }
            result += '}';
            for (var rep in replacements) {
                result = result.replace(rep, replacements[rep]);
            }
            return beautify(result);
        }
    }
})();

module.exports = SolBuilder;
