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
        return me.array(source, template);
    }

    // This function creates the result of one level of the tree
    return me.level(source, template);
};
Processor.prototype.array = function(source, template) {
    var me = this,
        templateKeys = Object.keys(template);

    if (templateKeys.indexOf('*') >= 0) {
        return me.allElements(source, template);
    }
    return me.someElements(source, template);
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
    var sourceKeys = Object.keys(source);

    result = _.clone(source);

    _.each(templateKeys, function(key, value) {
        if (template['*']) {
            _.each(sourceKeys, function(sourceKey) {
                result[sourceKey] = me.process(source[sourceKey], template['*']);
            });
        } else {
            var propertyTemplate = template[key],
                oldProp,
                subTemplate;
            if (propertyTemplate instanceof Array) {
                oldProp = propertyTemplate[0];
                subTemplate = propertyTemplate[1];
            } else if (propertyTemplate instanceof Object) {
                oldProp = key;
                subTemplate = propertyTemplate;
            } else {
                oldProp = propertyTemplate;
                subTemplate = {};
            }
            delete result[oldProp];
            if (source[oldProp] !== undefined) {
                result[key] = me.process(source[oldProp], subTemplate);
            }
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
