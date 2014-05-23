var _ = require('underscore');

exports.transform = transform;

function transform(orig, config) {
    if (orig instanceof Array) {
       return _.map(orig, function(suborig) {
           return transform(suborig, config);
       }); 
    }
    try {
        var o_keys = Object.keys(orig);
        var c_keys = Object.keys(config);
    } catch (e) {
        console.log("catch orig", orig);
        console.log("catch config", config);
        return orig;
    }

    console.log("o_keys", o_keys);
    console.log("c_keys", c_keys);

    var i_keys = [];
    if (c_keys.indexOf('*') >= 0) {
        i_keys = o_keys;
    } else {
        i_keys = _.intersection(o_keys, c_keys);
    }

    console.log("i_keys", i_keys);
    console.log("config", config);

    return rec(i_keys, orig, config);
}

function rec(keys, obj, config) {
    var result = {};
    _.each(keys, function(key) {
        if (config['*']) {
            result[key] = transform(obj[key], config['*']);
        } else {
            result[key] = transform(obj[key], config[key]);
        }
    });
    return result;
}
