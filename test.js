var _ = require('underscore');

var original = {
    facets: {
        'test1': {
            'x': 'y',
            'y': 'z'
        },
        'test2': {
            'foo': 'bar'
        }
    },
    'test': [{
        'doc': 'bla',
        'messy': 666,
    },{
        'doc': 'blubb',
        'messy': 777
    }
    ],
    'products': {
        1234: {
            'id': 1234,
            'name': 'Product 1',
            'messy': 666
        },
        5678: {
            'id': 5678,
            'name': 'Product 2',
            'messy': 666
        }
    }
}

// var template = {
//     'facets': {
//         'test1': true
//     }
// }
// var template = {
//     'facets': {
//         '*': true
//     }
// }
// var template = {
//     'products': {
//         '*': {
//             'id': true
//         }
//     }
// }
var template = {
    'test': {
        'doc': true
    }
}



function match(orig, config) {
    if (orig instanceof Array) {
       return _.map(orig, function(suborig) {
           return match(suborig, config);
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
            result[key] = match(obj[key], config['*']);
        } else {
            result[key] = match(obj[key], config[key]);
        }
    });
    return result;
}

console.log(match(original, template));
