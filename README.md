fanci
=====

Fanci is a lightweight node module to extract a subset of a JSON based on a template.

The initial goal was to consume a large JSON from an external API, and transform this in a smaller JSON with only the relevant fields.
Unfortunately the available solutions did not really solve this problem (e.g. json-path, jsont, JSONStream, ...), at least not up to this level that we needed.

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
var target = fanci.transform(origial, template));
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
