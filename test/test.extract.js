/*jshint expr: true*/
var expect = require('chai').expect;

var fanci = require('../lib/fanci');
var source = require('../example/source');

describe('Extract full object', function() {
    it('should return the whole objects as it was before', function() {
        var template = {
            '*': true
        };
        expect(fanci.extract(source, template)).to.be.deep.equal(source);
    });
});

describe('Extract empty template', function() {
    it('should return an empty object', function() {
        var template = {};
        expect(fanci.extract(source, template)).to.be.empty;
    });
});

describe('Extract empty source', function() {
    it('should return an empty object', function() {
        var template = {
            'products': {
                '*': true
            }
        };
        expect(fanci.extract({}, template)).to.be.empty;
    });
});

describe('Extract arbitrary keys with *', function() {
    it('should return all objects', function() {
        var template = {
            'products': {
                '*': true
            }
        };
        expect(fanci.extract(source, template)).to.be.deep.equal({
            "products": {
                "1234": {
                    "id": 1234,
                    "internal_id": "X04BEEF",
                    "name": "The Beef",
                    "status": {
                        "available": true
                    },
                    "delivery": {
                        "company": "My Transport",
                        "rate": "business_hour",
                        "time": "daily"
                    }
                },
                "4567": {
                    "id": 4567,
                    "internal_id": "X08CAFE",
                    "name": "El Coffee",
                    "status": {
                        "available": true
                    },
                    "delivery": {
                        "company": "Ayayay",
                        "rate": "weekend",
                        "time": "weekend"
                    }
                },
                "6789": {
                    "id": 6789,
                    "internal_id": "X07DEAD",
                    "name": "Life Product",
                    "status": {
                        "available": false
                    },
                    "delivery": {
                        "company": "My Transport",
                        "rate": "business_hour",
                        "time": "weekend"
                    }
                }
            }
        });
    });
});

describe('Extract only a subset of keys', function() {
    it('should return objects with only those keys', function() {
        var template = {
            'products': {
                '*': {
                    'id': true,
                    'name': true,
                    'status': true
                }
            }
        };
        expect(fanci.extract(source, template)).to.be.deep.equal({
            "products": {
                "1234": {
                    "id": 1234,
                    "name": "The Beef",
                    "status": {
                        "available": true
                    }
                },
                "4567": {
                    "id": 4567,
                    "name": "El Coffee",
                    "status": {
                        "available": true
                    }
                },
                "6789": {
                    "id": 6789,
                    "name": "Life Product",
                    "status": {
                        "available": false
                    }
                }
            }
        });
    });
});

describe('Extract an array of objects', function() {
    it('should return the array of objects', function() {
        var template = {
            'docs': true
        };
        expect(fanci.extract(source, template)).to.be.deep.equal({
            "docs": [
                {
                    "author": "Gandalf",
                    "date": "2014-02-03",
                    "description": "Put some magic in here"
                },
                {
                    "author": "Harry",
                    "date": "2014-02-04",
                    "description": "Rainbow Unicorns!"
                },
                {
                    "author": "Phil",
                    "date": "2014-05-19",
                    "description": "Valuable information"
                },
                {
                    "author": "Odi",
                    "date": "2014-05-22",
                    "description": "Fanci stuff!"
                }
            ]
        });
    });
});

describe('Extract object subset from array', function() {
    it('should return objects with only those keys', function() {
        var template = {
            'docs': {
                '*': {
                    'author': true
                }
            }
        };
        expect(fanci.extract(source, template)).to.be.deep.equal({
            "docs": [
                {
                    "author": "Gandalf"
                },
                {
                    "author": "Harry"
                },
                {
                    "author": "Phil"
                },
                {
                    "author": "Odi"
                }
            ]
        });
    });
});

describe('Extract from array', function() {
    it('should return an array with the extacted objects', function() {
        var template = {
            '*': {
                'author': true
            }
        };
        expect(fanci.extract(source.docs, template)).to.be.deep.equal([
            {
                "author": "Gandalf"
            },
            {
                "author": "Harry"
            },
            {
                "author": "Phil"
            },
            {
                "author": "Odi"
            }
        ]);
    });
});

describe('Extract subset from array', function() {
    it('should return only the specified subset of the array', function() {
        var template = {
            'docs': {
                '0': {
                    'author': true
                },
                '3': {
                    'description': true
                }
            }
        };
        expect(fanci.extract(source, template)).to.be.deep.equal({
            "docs": [
                {
                    "author": "Gandalf"
                },
                {
                    "description": "Fanci stuff!"
                }
            ]
        });
    });
});
