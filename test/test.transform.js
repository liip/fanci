/*jshint expr: true*/

var expect = require('chai').expect;
var _ = require('underscore');

var fanci = require('../lib/fanci');
var source = require('../example/source');

describe('Return only one of two root keys', function() {
    it('should return the docs object with new key', function() {
        var template = {
            'documents': 'docs'
        };
        var result = fanci.transform(source, template);

        expect(Object.keys(result)).to.be.deep.equal([ 'documents' ]);
    });
});

describe('Return only the sub-object', function() {
    it('should return the docs object with new key', function() {
        var template = {
            'status1234': 'products.1234.status'
        };
        var result = fanci.transform(source, template);

        expect(result).to.be.deep.equal({
            'status1234': {
                'available': true
            }
        });
    });
});

describe('Using an empty template', function() {
    it('should return an empty object', function() {
        var template = {};
        var result = fanci.transform(source, template);
        expect(result).to.be.empty;
    });
});

describe('Using a * template', function() {
    it('should return its values as an array', function() {
        var obj = {
            'foo': 'bar',
            'list': [
                { 'test': 1 },
                { 'test': 2 }
            ]
        };
        var template = { 'test': '*' };

        var result = fanci.transform(obj, template);

        expect(result['test']).to.be.deep.equal([
            'bar',
            { 'test': 1 },
            { 'test': 2 }
        ]);
    });
});

describe('Using the wrong template path', function() {
    it('should return an undefined object', function() {
        var template = {
            'status1234': 'products.xyz'
        };
        var result = fanci.transform(source, template);

        expect(result).to.be.deep.equal({});
    });
});

describe('Use several templates at once', function() {
    it('should return the correct object for each given template', function() {
        var template = {
            'status1234': 'products.1234.status',
            'status4567': 'products.4567.status'
        };
        var result = fanci.transform(source, template);

        expect(result).to.be.deep.equal(
            {
                'status1234': {
                    'available': true
                },
                'status4567': {
                    'available': true
                }
            }
        );
    });
});

describe('Transform objects from an array', function() {
    it('should return the correct object for each array template', function() {
        var template = {
            'author': 'docs.1.author',
            'desc': 'docs.0.description',
            'delivery': 'products.6789.delivery'
        };
        var result = fanci.transform(source, template);

        expect(result).to.be.deep.equal(
            {
                'author': 'Harry',
                'desc': 'Put some magic in here',
                'delivery': {
                    'company': 'My Transport',
                    'rate': 'business_hour',
                    'time': 'weekend'
                }
            }
        );
    });
});

describe('Use the * to jump over one level', function() {
    it('should return the correct object for the wildcard', function() {
        var template = {
            'authors': 'docs.*.author'
        };
        var result = fanci.transform(source, template);

        expect(result).to.be.deep.equal({
            'authors': [
                'Gandalf',
                'Harry',
                'Phil',
                'Odi'
            ]
        });
    });
});

describe('Use the * to jump over several levels', function() {
    it('should return the correct object for the wildcards', function() {
        var template = {
            'available': 'products.*.*.available'
        };
        var result = fanci.transform(source, template);

        expect(result).to.be.deep.equal({
            'available': [
                true,
                true,
                false
            ]
        });
    });
});

describe('Use the * to jump over one non-array level', function() {
    it('should return the correct object without array', function() {
        var template = {
            'company': '*.company'
        };
        var result = fanci.transform(source.products['1234'], template);

        expect(result).to.be.deep.equal({
            'company': 'My Transport'
        });
    });
});

describe('Use the * if there are no value', function() {
    it('should return the an empty array', function() {
        var template = {
            'company': '*.companies'
        };
        var result = fanci.transform(source.products['1234'], template);

        expect(result).to.be.deep.equal({
            'company': []
        });
    });
});

describe('Use a nested template for more complex objects', function() {
    it('should return an object structured like the nested template', function() {
        var template = {
            'transport': {
                'company': 'products.1234.delivery.company'
            },
            'ids': 'products.*.id',
            'state': {
                'level': 'products.*.status'
            }
        };
        var result = fanci.transform(source, template);

        expect(result).to.be.deep.equal({
            'transport': {
                'company': 'My Transport'
            },
            'ids': [ 1234, 4567, 6789 ],
            'state': {
                'level': [
                    { 'available': true },
                    { 'available': true },
                    { 'available': false }
                ]
            }
        });
    });
});

describe('Construct an array', function() {
    it('should return the array with the corresponding values', function() {
        var template = {
            'names': [
                'products.1234.name',
                'products.4567.name',
                'products.6789.name'
            ]
        };
        var result = fanci.transform(source, template);

        expect(result['names']).to.be.deep.equal(
            [
                'The Beef',
                'El Coffee',
                'Life Product'
            ]
        );
    });
});

describe('Use a format function', function() {
    it('should return the formatted object', function() {
        var template = {
            'upper': [
                'products.1234.name',
                function(value) {
                    return value.toUpperCase();
                }
            ]
        };
        var result = fanci.transform(source, template);

        expect(result).to.be.deep.equal(
            {
                'upper': 'THE BEEF'
            }
        );
    });
});

describe('Use a format function on an array', function() {
    it('should return the formatted object', function() {
        var template = {
            'lower_names': [
                'products.*.name',
                function(values) {
                    return _.map(values, function(value) {
                        return value.toLowerCase();
                    });
                }
            ]
        };
        var result = fanci.transform(source, template);

        expect(result).to.be.deep.equal(
            {
                'lower_names': [
                    'the beef',
                    'el coffee',
                    'life product'
                ]
            }
        );
    });
});

describe('Use a more complex transformation with two format functions', function() {
    it('should return the new transformed and formatted object', function() {
        var obj = {
            'Datum': '2014-03-15',
            'Oel': 'X',
            'Glas': '',
            'Metall': 'X'
        };
        var formatFn = function(value) {
            return (value === 'X');
        };
        var template = {
            'date': [
                'Datum',
                function(value) {
                    var dateObj = new Date(value);
                    return dateObj.toISOString();
                }
            ],
            'kind': {
                'oil': [ 'Oel', formatFn ],
                'glass': [ 'Glas', formatFn ],
                'metal': [ 'Metall', formatFn ]
            }
        };
        var result = fanci.transform(obj, template);

        expect(result).to.be.deep.equal(
            {
                'date': '2014-03-15T00:00:00.000Z',
                'kind': {
                    'oil': true,
                    'glass': false,
                    'metal': true
                }
            }
        );
    });
});

describe('Return only the internal_id value', function() {
    it('should return internal_id value match based on wildcard *ar:*', function() {
        var template = {
            'match_only_*ar:*': 'products.*ar:*.internal_id'
        };
        var result = fanci.transform(source, template);

        expect(result).to.be.deep.equal({
            'match_only_*ar:*': [
                'char:1',
                'char:2',
                'bar:1'
            ]
        });
    });
});

describe('Return products containing 4 in id', function() {
    it('should return products 1234 and 4567', function() {
        var template = {
            'four_products': 'products.*4*.name'
        };
        var result = fanci.transform(source, template);

        expect(result).to.be.deep.equal({
            'four_products': [
                'The Beef',
                'El Coffee'
            ]
        });
    });
});

describe('Return products ending with 4', function() {
    it('should return product 1234', function() {
        var template = {
            'four_products': 'products.*4.name'
        };
        var result = fanci.transform(source, template);

        expect(result).to.be.deep.equal({
            'four_products': 'The Beef'
        });
    });
});

describe('Return products starting with 4', function() {
    it('should return product 4567', function() {
        var template = {
            'four_products': 'products.4*.name'
        };
        var result = fanci.transform(source, template);

        expect(result).to.be.deep.equal({
            'four_products': 'El Coffee'
        });
    });
});

describe('Return ids of products starting with 4 and ending with 7', function() {
    it('should return ids of product 4567', function() {
        var template = {
            'ids': 'products.4*7.*id*'
        };
        var result = fanci.transform(source, template);

        expect(result).to.be.deep.equal({
            'ids': [
                 4567,
                 'X08CAFE'
            ]
        });
    });
});
