var fanci = require('../lib/fanci');
var source = require('./source');

// Take all products ('*') but only the id, name and status keys
var product_template = {
    'products': {
        '*': {
            'id': true,
            'name': true,
            'status': true
        }
    }
}
console.log(fanci.transform(source, product_template));

// If the JSON contains an array, the rules of one level are applied to all elements of the array
var doc_template = {
    'docs': {
        'description': true
    }
}
console.log(fanci.transform(source, doc_template));
