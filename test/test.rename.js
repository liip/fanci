/*jshint expr: true*/

var expect = require( 'chai' ).expect;
var _ = require( 'underscore' );

var fanci = require( '../lib/fanci' );
var source = require( '../example/source' );

describe( 'Rename root keys of object', function() {
    it( 'should return the whole object with new root keys', function() {
        var template = {
            'stock': 'products',
            'library': 'docs'
        };
        var result = fanci.rename( source, template );

        expect( Object.keys( result ) ).to.be.deep.equal( [ 'stock', 'library' ] );
    } );
} );

describe( 'Rename with empty template', function() {
    it( 'should return the same object as before', function() {
        var obj = {
            'test': {
                'hallo': 'velo'
            },
            'langs': [ 'PHP', 'JavaScript', 'Sass' ]
        };
        var template = {};
        var result = fanci.rename( obj, template );

        expect( result ).to.be.deep.equal( obj );
    } );
} );

describe( 'Rename with non-matching template', function() {
    it( 'should return the same object as before', function() {
        var obj = {
            'test': {
                'hallo': 'velo'
            },
            'langs': [ 'PHP', 'JavaScript', 'Sass' ]
        };
        var template = {
            'language': 'lang'
        };
        var result = fanci.rename( obj, template );

        expect( result ).to.be.deep.equal( obj );
    } );
} );

describe( 'Rename with empty source', function() {
    it( 'should return an empty object', function() {
        var obj = {};
        var template = {
            'language': 'lang'
        };
        var result = fanci.rename( obj, template );

        expect( result ).to.be.empty;
    } );
} );

describe( 'Rename parent-only', function() {
    it( 'should return the object with renamed parent keys', function() {
        var obj = {
            'test': {
                'hallo': {
                    'velo': 'foobar'
                }
            },
            'langs': [ 'PHP', 'JavaScript', 'Sass' ]
        };
        var template1 = {
            'velo': 'test'
        };
        var template2 = {
            'velo': [ 'test' ]
        };

        var result1 = fanci.rename( obj, template1 );
        expect( result1 ).to.be.deep.equal( {
            'velo': {
                'hallo': {
                    'velo': 'foobar'
                }
            },
            'langs': [ 'PHP', 'JavaScript', 'Sass' ]
        } );

        var result2 = fanci.rename( obj, template2 );
        expect( result2 ).to.be.deep.equal( {
            'velo': {
                'hallo': {
                    'velo': 'foobar'
                }
            },
            'langs': [ 'PHP', 'JavaScript', 'Sass' ]
        } );
    } );
} );

describe( 'Rename parent and child', function() {
    it( 'should return the object with renamed parent and child keys', function() {
        var obj = {
            'test': {
                'hallo': {
                    'velo': 'foobar'
                }
            },
            'langs': [ 'PHP', 'JavaScript', 'Sass' ]
        };
        var template = {
            'velo': [
                'test',
                {
                    'hello': [
                        'hallo',
                        {
                            'blubb': 'velo'
                        }
                    ]
                }
            ]
        };
        var result = fanci.rename( obj, template );

        expect( result ).to.be.deep.equal( {
            'velo': {
                'hello': {
                    'blubb': 'foobar'
                }
            },
            'langs': [ 'PHP', 'JavaScript', 'Sass' ]
        } );
    } );
} );

describe( 'Rename child-only', function() {
    it( 'should return the object with renamed child keys', function() {
        var obj = {
            "products": {
                "1234": {
                    "name": "The Beef",
                    "status": {
                        "available": true
                    },
                    "delivery": {
                        "company": "My Transport",
                        "time": "daily"
                    }
                },
                "4567": {
                    "name": "El Coffee",
                    "status": {
                        "available": true
                    },
                    "delivery": {
                        "company": "Ayayay",
                        "time": "weekend"
                    }
                }
            }
        };

        var template = {
            'stock': [
                'products',
                {
                    '*': {
                        'transport': 'delivery',
                        'status': {
                            'in_stock': 'available'
                        }
                    }
                }
            ]
        };
        var result = fanci.rename( obj, template );

        expect( result ).to.be.deep.equal( {
            "stock": {
                "1234": {
                    "name": "The Beef",
                    "status": {
                        "in_stock": true
                    },
                    "transport": {
                        "company": "My Transport",
                        "time": "daily"
                    }
                },
                "4567": {
                    "name": "El Coffee",
                    "status": {
                        "in_stock": true
                    },
                    "transport": {
                        "company": "Ayayay",
                        "time": "weekend"
                    }
                }
            }
        } );
    } );
} );

describe( 'Rename child key of object', function() {
    it( 'should return the whole object with the renamed key', function() {
        var template = {
            '*': {
                'transport': 'delivery'
            }
        };
        var result = fanci.rename( source.products, template );
        expect( result ).to.be.deep.equal( {
            "1234": {
                "id": 1234,
                "internal_id": "X04BEEF",
                "name": "The Beef",
                "status": {
                    "available": true
                },
                "transport": {
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
                "transport": {
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
                "transport": {
                    "company": "My Transport",
                    "rate": "business_hour",
                    "time": "weekend"
                }
            },
            "char:1": {
                "internal_id": "char:1"
            },
            "char:2": {
                "internal_id": "char:2"
            },
            "bar:1": {
                "internal_id": "bar:1"
            },
            "foo:1": {
                "internal_id": "foo:1"
            }
        } );
    } );
} );

describe( 'Rename multiple child keys of object', function() {
    it( 'should return the whole object with the renamed keys', function() {
        var template = {
            '*': {
                'identifier': 'id',
                'transport': 'delivery',
                'quo': [ 'status', { 'vadis': 'available' } ]
            }
        };
        var result = fanci.rename( source.products, template );
        expect( result ).to.be.deep.equal( {
            "1234": {
                "identifier": 1234,
                "internal_id": "X04BEEF",
                "name": "The Beef",
                "quo": {
                    "vadis": true
                },
                "transport": {
                    "company": "My Transport",
                    "rate": "business_hour",
                    "time": "daily"
                }
            },
            "4567": {
                "identifier": 4567,
                "internal_id": "X08CAFE",
                "name": "El Coffee",
                "quo": {
                    "vadis": true
                },
                "transport": {
                    "company": "Ayayay",
                    "rate": "weekend",
                    "time": "weekend"
                }
            },
            "6789": {
                "identifier": 6789,
                "internal_id": "X07DEAD",
                "name": "Life Product",
                "quo": {
                    "vadis": false
                },
                "transport": {
                    "company": "My Transport",
                    "rate": "business_hour",
                    "time": "weekend"
                }
            },
            "char:1": {
                "internal_id": "char:1"
            },
            "char:2": {
                "internal_id": "char:2"
            },
            "bar:1": {
                "internal_id": "bar:1"
            },
            "foo:1": {
                "internal_id": "foo:1"
            }
        } );
    } );
} );

describe( 'Rename multiple child keys of object in array', function() {
    it( 'should return the whole array with objects with renamed keys', function() {
        var template = {
            '*': {
                'writer': 'author'
            }
        };
        var result = fanci.rename( source.docs, template );
        expect( result ).to.be.deep.equal( [
            {
                "writer": "Gandalf",
                "date": "2014-02-03",
                "description": "Put some magic in here"
            },
            {
                "writer": "Harry",
                "date": "2014-02-04",
                "description": "Rainbow Unicorns!"
            },
            {
                "writer": "Phil",
                "date": "2014-05-19",
                "description": "Valuable information"
            },
            {
                "writer": "Odi",
                "date": "2014-05-22",
                "description": "Fanci stuff!"
            }
        ] );
    } );
} );

describe( 'Rename multiple child keys of object in array without asterisk', function() {
    it( 'should return the whole array with objects with renamed keys', function() {
        var template = {
            'writer': 'author'
        };
        var result = fanci.rename( source.docs, template );
        expect( result ).to.be.deep.equal( [
            {
                "writer": "Gandalf",
                "date": "2014-02-03",
                "description": "Put some magic in here"
            },
            {
                "writer": "Harry",
                "date": "2014-02-04",
                "description": "Rainbow Unicorns!"
            },
            {
                "writer": "Phil",
                "date": "2014-05-19",
                "description": "Valuable information"
            },
            {
                "writer": "Odi",
                "date": "2014-05-22",
                "description": "Fanci stuff!"
            }
        ] );
    } );
} );

describe( 'Rename only subset from array', function() {
    it( 'should return the object with only the subset of the array with replaced keys', function() {
        var template = {
            '0': {
                'writer': 'author'
            },
            '3': {
                'desc': 'description'
            }
        };
        expect( fanci.rename( source.docs, template ) ).to.be.deep.equal( [
            {
                "writer": "Gandalf",
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
                "desc": "Fanci stuff!"
            }
        ] );
    } );
} );
