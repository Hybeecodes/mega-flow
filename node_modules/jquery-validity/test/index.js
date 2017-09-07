
var validator = require('validator')
var $ = require('jquery')
require('../index')($)

window.$ = $

$('form').validity({
  /*onSubmit: function (event, form) {
    setTimeout(function () {
      form.submit()
    }, 500)
    console.log('submitting..', form)
  },*/
  // timeout: false,
  focusOnFirstError: false,
  requiredMessage: 'This thing is required',
  validators: {
    email: function (value) {
      if (!validator.isEmail(value)) {
        return 'Please enter a valid email'
      }
      return null
    },
    color: function (value) {
      if (value === '') {
        return null
      }
      if (value === 'groc' || value === 'blau' || value === 'vermell') {
        return null
      }
      return 'Only the three basic colors are allowed'
    },
    images: function (value, name, el) {
      var files = el.files
      var re = /png|jpg|jpeg|gif/
      var type

      if (!files.length) {
        return null
      }
      type = files[0].type
      if (!re.test(type)) {
        return 'No files other than images, please'
      }
      return null
    }
  }
})
.on('validity.invalid', function (event, data) {
  console.log('--invalid')
  console.log(data.firstErrorField)
  console.log(data.fields)
})
.on('validity.valid', function (event, data) {
  data.submitEvent.preventDefault()
  console.log('yep')
})
