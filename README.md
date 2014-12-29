fanci
=====

[![Build Status](https://travis-ci.org/liip/fanci.svg?branch=master)](https://travis-ci.org/liip/fanci)

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
var target = fanci.extract(origial, template);
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

You can find more examples in the example directory.

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
    'id': 'products.1234.internal_id,
    'company': 'products.4567.delivery.company,
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
    "available": [
        true,
        true
    ]
}
```

You can find more examples in the example directory.

#### Template

The template defines the new structure of the resulting object. The values are _paths_ in the original JSON. Like that, it is possible to select nested elements and to put them in a new strucutre. By using the asteriks all elements of a level are considered. The resulting array in flattend or even removed completly if it only contains one item.

```javascript
{
    'pics': {
        'id': 'pics.id',
        'date': 'pics.date',
        'authors': 'pics.*.author.name'
    }
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


## Tests

To run the tests simply use the following command:

```bash
npm test
```

[json-path]: https://github.com/flitbit/json-path
[jsont]: https://github.com/CamShaft/jsont
[json2json]: https://github.com/joelvh/json2json
[jsonstream]: https://github.com/dominictarr/JSONStream
