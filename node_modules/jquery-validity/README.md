# jQuery Validity

A form validation jQuery plugin written in late 2015 (whatever that means).

This is heavily inspired by the [Abide](http://foundation.zurb.com/docs/components/abide.html) library (from the Zurb Foundation framework), but implemented completely from scratch and as a jQuery plugin, npm-ready and most of all not bloated.

## Install

Using `npm`:

```bash
npm install jquery-validity
```

Browserify and others:

```js
var $ = require('jquery')
require('jquery-validity')($)
```

ES2015 modules:

```js
import $ from 'jquery'
import validity from 'jquery-validity'

validity($)
```

## Usage

```js
$('.my-form').validity(options)
```

### Options

There are the defaults:

```js
$.fn.validity.defaults = {
  attributeName: 'data-validators',
  errorClass: 'error',
  focusOnFirstError: true,
  onSubmit: null,
  parentSelector: 'p',
  requiredMessage: 'This field is required',
  timeout: 1000, // if `false`, no "live" validation
  validateOnBlur: true,
  validators: {}
}
```

### Events

```js
$form.on('validity.invalid', {
  fields,
  firstErrorField,
  form,
  submitEvent // original submit event
})

$form.on('validity.valid', {
  form,
  submitEvent
})
```

(TODO)

An example of an email validator function:

```js
function emailValidator (message) {
  // A `validator` is a function that receives a `value`
  // and should return `null` if valid, or a message if not
  return function (value) {
    if (validator.isEmail(value)) {
      return null
    }
    return message
  }
}
```

## TODO

- Proper tests
- Finish documentation
- A better usage guide and examples

## License

MIT
