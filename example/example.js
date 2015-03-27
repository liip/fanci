var fanci = require( '../lib/fanci.js' );
var source = require( './source' );

// Take all products ( '*' ) but only the id, name and status keys
var productTemplate = {
    'products': {
        '*': {
            'id': true,
            'name': true,
            'status': true
        }
    }
};
console.log( "All products with id, name and status", fanci.extract( source, productTemplate ) );

// If the JSON contains an array, use '*' so all the rules of are applied to all elements of the array
var docTemplate = {
    'docs': {
        '*': {
            'description': true
        }
    }
};
console.log( "Extract only one key from an array", fanci.extract( source, docTemplate ) );

// Alternatively you can specify certain array indices to extract only a subset
var docTemplate = {
    'docs': {
        '1': {
            'description': true
        },
        '3': {
            'author': true
        }
    }
};
console.log( "Specify which array elements should be extracted", fanci.extract( source, docTemplate ) );
