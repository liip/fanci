fanci
=====

[![Build Status](https://travis-ci.org/liip/fanci.svg?branch=master)](https://travis-ci.org/liip/fanci)

[![NPM](https://nodei.co/npm/fanci.png)](https://nodei.co/npm/fanci/)

Fanci is a lightweight node module to extract a subset of a JSON based on a template.

The initial goal was to consume a large JSON from an external API, and extract a smaller JSON with only the relevant fields.
Unfortunately the available solutions did not really solve this problem (e.g.  [json-path][json-path], [jsont][jsont], [json2json][json2json], [JSONStream][jsonstream], ...), at least not up to this level that we needed.

Note that this library does not _change_ the JSON structure, it can be used to extract a subset of the keys or array elements.

## Usage

Using `fanci` is very easy. All you need is your original JSON and a template which defines the new fields:

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

### Template

The given JSON is compared to the template JSON. The structure can not be changed, i.e. each level in the original has its equivalent in the template.
If the template does not specify deeper levels, the original JSON is transfered.

```javascript
{
    'pic': {
        'id': true,
        'date': true,
        'author': { // from the 'author' object only 'name' is extracted
            'name': true
        }
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

## Tests

To run the tests simply use the following command:

```bash
npm test
```

[json-path]: https://github.com/flitbit/json-path
[jsont]: https://github.com/CamShaft/jsont
[json2json]: https://github.com/joelvh/json2json
[jsonstream]: https://github.com/dominictarr/JSONStream
