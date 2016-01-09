fanci
=====

[![Build Status](https://travis-ci.org/liip/fanci.svg?branch=master)](https://travis-ci.org/liip/fanci)
[![Dependency Status](https://david-dm.org/liip/fanci.svg)](https://david-dm.org/liip/fanci)
[![devDependency Status](https://david-dm.org/liip/fanci/dev-status.svg)](https://david-dm.org/liip/fanci#info=devDependencies)

[![NPM](https://nodei.co/npm/fanci.png)](https://nodei.co/npm/fanci/)

Fanci is a lightweight node module to extract a subsets (using `extract()`), rename keys (using `rename()`) or tranform the structure (using `transform()`) of a JSON based on a template.

The initial goal was to consume a large JSON from an external API, and extract a smaller JSON with only the relevant fields.
Unfortunately the available solutions did not really solve this problem (e.g.  [json-path][json-path], [jsont][jsont], [json2json][json2json], [JSONStream][jsonstream], ...), at least not up to this level that we needed.


* `extract()` does not change the original structure of the object, it extracts a subset of its keys
* `rename()` does not change the original structure of the object, it can rename keys. All not renamed keys remain the same.
* `transform()` changes the structure of the object, only the defined keys will be in the resulting object

All these methods take a source object as their first parameter and a template as their second. The template defines how the resulting JSON looks like.


## Usage

Using `fanci` is very easy. All you need is your original JSON and a template which defines whats to do.
You can find more examples in the example and test directory.

### `extract` keys from JSON

```javascript
var fanci = require('fanci');

var original = {
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
        }
    }
};

var template = {
    'products': {
        '*': {
            'id': true,
            'name': true
        }
    }
}
var target = fanci.extract(original, template);
```

#### Result

`target` now contains the JSON with the fields from the template:

```javascript
{
    "products": {
        "1234": {
            "id": 1234,
            "name": "The Beef"
        },
        "4567": {
            "id": 4567,
            "name": "El Coffee"
        }
    }
}
```


#### Template

The given JSON is compared to the template JSON. The structure can not be changed, i.e. each level in the original has its equivalent in the template.
If the template does not specify deeper levels, the original JSON is transfered.

```javascript
{
    'pic': {
        'id': true,
        'date': true,
        'author': { // from the 'author' object only 'name' is extracted
            'name': true
        },
        'urls': true // if 'urls' is an object, the whole object is extracted
    }
}
```

When dealing with arrays you can specify single array positions as object keys.

```javascript
{
    'posts': { // here only the 3rd and 8th item from the posts array are extracted
        '2': true // the whole object is extracted
        '7': { // only the comments field containing the first comment is extracted
            'comments': {
                '0': true
            }
        }
    }
}
```

### `rename` keys from JSON

```javascript
var fanci = require('fanci');

var original = {
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
    'stock': ['products', {
        '*': {
            'transport': 'delivery',
            'status': {
                'in_stock': 'available'
            }
        }
    }]
}
var target = fanci.rename(origial, template);
```

#### Result

`target` now contains the JSON with the renamed keys from the template:

```javascript
{
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
}
```

#### Template

In the template the new names are defined. For each new name, the old key has to be given as its value. To be able to change parent keys for objects and array, the template supports arrays to define the new names of the keys. That way arbitrary structures can processed.

```javascript
{
    'books': {
        'id': 'identifier', //rename key 'identifier' to 'id'
        'writer': ['author', { //rename 'author' to 'writer' AND specify further rules for the next level
            'name': 'title' // rename the authors 'title' property to 'name'
        }]
    }
}
```

When dealing with arrays you can specify single array positions as object keys.

```javascript
{
    'posts': { // here only the 3rd and 8th item from the posts array are renamed
        '2': {
            'name': 'fullname'
        },
        '7': {
            'name': 'firstname'
        }
    }
}
```

### `transform` the structure of a JSON

```javascript
var fanci = require('fanci');

var original = {
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
        }
    }
};

var template = {
    'id': 'products.1234.internal_id',
    'company': 'products.4567.delivery.company',
    'name': [
        'products.6789.name',
        function(value) {
            return value.toUpperCase();
        }
    ],
    'available': 'products.*.status.available'
}
var target = fanci.transform(origial, template);
```

#### Result

`target` now contains the JSON with the fields from the template:

```javascript
{
    "id": "X04BEEF",
    "company": "Ayayay",
    "name": "LIFE PRODUCT",
    "available": [
        true,
        true
    ]
}
```

#### Template

The template defines the new structure of the resulting object. The values are _paths_ in the original JSON. Like that, it is possible to select nested elements and to put them in a new strucutre. By using the asteriks all elements of a level are considered. The resulting array in flattend or even removed completly if it only contains one item.
It is possible to specify a format function to be applied to the object extracted from the path. This opens new possibilities to generate more complex structures. To do this, you have to specify an array instead of the path string, the first element is the path string, the second one is a function that takes the extracted object as an argument.
If the second element is not a function, it is assumed that you wanted to construct an array in the resulting object.

```javascript
{
    'pics': {
        'id': 'pics.id',
        'dates': [
            'pics.1.date',
            'pics.3.date',
            'pics.5.date',
        ],
        'authors': 'pics.*.author.name'
    },
    'date': [
        'Date',
        function(value) {
            return new Date(value);
        }
    ]
}
```

### Special meaning of the `*` character

The asterisk (`*`) has a special meaning in the template:

1. It means to use all keys from one level, this is useful when your JSON contains arbitrary keys

    ```javascript
    {
        'products': {
            '*': { // all keys below products are taken, but only with the 'name' key
                'name': true
            }
        }
    }
    ```
2. For arrays the asterisk represents all array elements

    ```javascript
    {
        'docs': {
            '*': { // if docs is an array, '*' ensures that all elements are extracted
                'author': true
            }
        }
    }
    ```

3. The same applies in the "path" that is used for `transform()`

    ```javascript
    {
        'authors': 'docs.*.author'
    }
    ```

4. In fact you can use * as a wildcard in the "path"

    ```javascript
    {
        // returns properties like 'name', 'my_name' or 'name_of_product' of products with ids starting with 4 and ending with 7 (e.g. 4567)
        'ids': 'products.4*7.*name*' 
    }
    ```


## Tests

To run the tests simply use the following command:

```bash
npm test
```

[json-path]: https://github.com/flitbit/json-path
[jsont]: https://github.com/CamShaft/jsont
[json2json]: https://github.com/joelvh/json2json
[jsonstream]: https://github.com/dominictarr/JSONStream
