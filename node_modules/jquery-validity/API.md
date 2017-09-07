# validity

Apply validation to one or more selected form elements.

**Parameters**

-   `options` **Object** 
    -   `options.attributeName` **string** The attribute used on input elements
        to determine its validator methods
    -   `options.requiredMessage` **string** The error message for the default
        `required` validator
    -   `options.parentSelector` **string** The element that groups radio or
        checkbox type inputs and receives the error class
    -   `options.timeout` **number or false** Number of milliseconds it takes for
        validation to occur after the latest user input (set `false` to disable)
    -   `options.onSubmit` **function** A callback that fires on submission of
        the form when valid
    -   `options.validateOnBlur` **boolean** 
    -   `options.validators` **Object** An object with the validator functions

Returns **Object** jQuery element instance
