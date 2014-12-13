var _ = require('underscore');

exports.extract = extract;
exports.rename = rename;

function extract(source, template) {
    try {
        var source_keys = Object.keys(source);
        var template_keys = Object.keys(template);
    } catch (e) {
        // if either source or template has no keys,
        // this means we reached the end of the tree
        return source;
    }
    if (source instanceof Array) {
        if (template_keys.indexOf('*') >= 0) {
            return _.map(source, function(subsource) {
                return extract(subsource, template['*']);
            });
        }
        var selectedElements = [];
        _.each(source, function(subsource, index) {
            if (template_keys.indexOf(index.toString()) >= 0) { 
                selectedElements.push(extract(subsource, template[index]));
            }
        });
        return selectedElements;
    }

    var intersect_keys = [];
    if (template_keys.indexOf('*') >= 0) {
        intersect_keys = source_keys;
    } else {
        intersect_keys = _.intersection(source_keys, template_keys);
    }

    return level_extract(intersect_keys, source, template);
}

// This function creates the result of one level of the tree
function level_extract(keys, obj, template) {
    var result = {};
    _.each(keys, function(key) {
        if (template['*']) {
            result[key] = extract(obj[key], template['*']);
        } else {
            result[key] = extract(obj[key], template[key]);
        }
    });
    return result;
}

function rename(source, template) {
    try {
        var source_keys = Object.keys(source);
        var template_keys = Object.keys(template);
    } catch (e) {
        // if either source or template has no keys,
        // this means we reached the end of the tree
        return source;
    }
    if (source instanceof Array) {
        if (template_keys.indexOf('*') >= 0) {
            return _.map(source, function(subsource, index) {
                return rename(subsource, template['*']);
            });
        }
        return _.map(source, function(subsource, index) {
            if (template_keys.indexOf(index.toString()) >= 0) { 
                subtemplate = template[index];
            } else {
                subtemplate = template;
            }
            return rename(subsource, subtemplate);
        });
    }
    return level_rename(source, template);
}

function level_rename(source, template) {
    var result = {};
    var template_keys = Object.keys(template);
    var keys = Object.keys(source);
    _.each(keys, function(key) {
        if(template['*']) {
            result[key] = rename(source[key], template['*'])
        } else if (template_keys.indexOf(key) >= 0) {
            property_template = template[key];
            if (property_template instanceof Array) {
                renamedProp = property_template[0];
                subTemplate = property_template[1];
            } else {
                renamedProp = property_template;
                subTemplate = {};
            }
            result[renamedProp] = rename(source[key], subTemplate)
        } else {
            result[key] = source[key];
        }
    });
    return result;
}
