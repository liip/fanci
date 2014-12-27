var _ = require('underscore');

/* Processor */
function Processor() {}
Processor.prototype.process =  function(source, template) {
    var me = this,
        sourceKeys,
        templateKeys;
    try {
        sourceKeys = Object.keys(source);
        templateKeys = Object.keys(template);
    } catch (e) {
        // if either source or template has no keys,
        // this means we reached the end of the tree
        return source;
    }
    if (source instanceof Array) {
        if (templateKeys.indexOf('*') >= 0) {
            return me.allElements(source, template);
        }
        return me.someElements(source, template);
    }

    // This function creates the result of one level of the tree
    return me.level(source, template);
};
Processor.prototype.allElements = function(source, template) {
    var me = this;
    return _.map(source, function(subsource) {
        return me.process(subsource, template['*']);
    });
};
Processor.prototype.someElements = function(source, template) {
    var me = this;
    var templateKeys = Object.keys(template);
    return _.map(source, function(subsource, index) {
        var subtemplate;
        if (templateKeys.indexOf(index.toString()) >= 0) {
            subtemplate = template[index];
        } else {
            subtemplate = template;
        }
        return me.process(subsource, subtemplate);
    });
};

/* Extractor */
function Extractor() {
    Processor.call(this);
}
Extractor.prototype = Object.create(Processor.prototype);
Extractor.prototype.constructor = Extractor;
Extractor.prototype.level = function(source, template) {
    var me = this;
    var sourceKeys = Object.keys(source);
    var templateKeys = Object.keys(template);
    var intersectKeys = [];
    if (templateKeys.indexOf('*') >= 0) {
        intersectKeys = sourceKeys;
    } else {
        intersectKeys = _.intersection(sourceKeys, templateKeys);
    }

    return me.extractLevel(intersectKeys, source, template);
};
// This function creates the result of one level of the tree
Extractor.prototype.extractLevel = function(keys, obj, template) {
    var me = this;
    var result = {};
    _.each(keys, function(key) {
        if (template['*']) {
            result[key] = me.process(obj[key], template['*']);
        } else {
            result[key] = me.process(obj[key], template[key]);
        }
    });
    return result;
};
Extractor.prototype.someElements = function(source, template) {
    var me = this;
    var templateKeys = Object.keys(template);
    var selectedElements = [];
    _.each(source, function(subsource, index) {
        if (templateKeys.indexOf(index.toString()) >= 0) {
            selectedElements.push(me.process(subsource, template[index]));
        }
    });
    return selectedElements;
};

/* Renamer */
function Renamer() {
    Processor.call(this);
}
Renamer.prototype = Object.create(Processor.prototype);
Renamer.prototype.constructor = Renamer;
Renamer.prototype.level = function(source, template) {
    var me = this;
    var result = {};
    var templateKeys = Object.keys(template);
    var keys = Object.keys(source);
    _.each(keys, function(key) {
        if (template['*']) {
            result[key] = me.process(source[key], template['*']);
        } else if (templateKeys.indexOf(key) >= 0) {
            var propertyTemplate = template[key],
                renamedProp,
                subTemplate;
            if (propertyTemplate instanceof Array) {
                renamedProp = propertyTemplate[0];
                subTemplate = propertyTemplate[1];
            } else if (propertyTemplate instanceof Object) {
                renamedProp = key;
                subTemplate = propertyTemplate;
            } else {
                renamedProp = propertyTemplate;
                subTemplate = {};
            }
            result[renamedProp] = me.process(source[key], subTemplate);
        } else {
            result[key] = source[key];
        }
    });
    return result;
};

var extract = new Extractor();
exports.extract = function(source, template) {
    return extract.process(source, template);
};
var rename = new Renamer();
exports.rename = function(source, template) {
    return rename.process(source, template);
};
