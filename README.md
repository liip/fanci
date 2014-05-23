fanci
=====

Fanci is a lightweight node module to transform JSON from one structure to another.

The initial goal was to consume a large JSON from an external library, and transform this in a smaller JSON with the relevant fields.
Unfortunately the available solutions did not really solve this problem (e.g. json-path, jsont, JSONStream, ...), at least not up to this level that we needed.

## Usage

Using `fanci` is very easy. All you need is your original JSON and a template which defines the new structure:

```javascript
var fanci = require('fanci');

var original = require('./origial');
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

You can find more examples in the example directory.
