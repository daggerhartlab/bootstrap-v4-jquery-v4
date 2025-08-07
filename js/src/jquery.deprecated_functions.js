/**
 * Determines if its argument is callable as a function.
 * As of jQuery 3.3, jQuery.isFunction() has been deprecated. In most cases, its use can be replaced by typeof x === "function".
 * More information: https://api.jquery.com/jQuery.isFunction/ */

import $ from 'jquery'

/** CONSTANTS AND VARIABLES * */

const class2type = {};

const toString = class2type.toString;

// Populate the class2type map.
jQuery.each(
  'Boolean Number String Function Array Date RegExp Object Error Symbol'.split(
    ' ',
  ),
  function (i, name) {
    class2type[`[object ${name}]`] = name.toLowerCase();
  },
);

jQuery.fx.interval = 13;

/**
 * Takes a well-formed JSON string and returns the resulting JavaScript value.
 * As of jQuery 3.0, $.parseJSON is deprecated. To parse JSON strings use the native JSON.parse method instead.
 */
/* eslint-disable-next-line no-useless-escape */
const rvalidtokens =
  /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;

/** FUNCTIONS * */

$.fn.isFunction = function (fn) {
  return typeof fn === 'function';
};

$.isFunction = function (obj) {
  return typeof obj === 'function';
};

$.type = function (obj) {
  if (obj == null) {
    return `${obj}`;
  }

  // Support: Android <=2.3 only (functionish RegExp)
  return typeof obj === 'object' || typeof obj === 'function'
    ? class2type[toString.call(obj)] || 'object'
    : typeof obj;
};

/**
 * Remove the whitespace from the beginning and end of a string.
 *
 * Note: This API has been deprecated in jQuery 3.5; please use the
 * native String.prototype.trim method instead. Unlike jQuery.trim,
 * String.prototype.trim does not work with types other than strings
 * (null, undefined, Number). Make sure that your code is compatible
 * when migrating.
 * More information: https://api.jquery.com/jQuery.trim/
 */

  // Support: Android<4.1, IE<9
  // Make sure we trim BOM and NBSP
const rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

// Support: Android<4.1, IE<9
$.trim = (text) => {
  return text == null ? '' : `${text}`.replace(rtrim, '');
};

/* Determine whether the argument is an array.
 * This API has been deprecated in jQuery 3.2; please use the native Array.isArray method instead.
 * MOre information: https://api.jquery.com/jQuery.isArray/ */
$.isArray = (obj) => {
  return jQuery.type(obj) === 'array';
};

/* The $.camelCase() function in jQuery converts a hyphenated string to
 * camel case. It is used internally by jQuery for manipulating CSS
 * properties and data attributes.  */
// Matches dashed string for camelizing
const rmsPrefix = /^-ms-/;
const rdashAlpha = /-([\da-z])/gi;

// Used by jQuery.camelCase as callback to replace()
$.fcamelCase = (all, letter) => {
  return letter.toUpperCase();
};

$.camelCase = (string) => {
  return string.replace(rmsPrefix, 'ms-').replace(rdashAlpha, $.fcamelCase);
};

/** The jQuery.isWindow() function is a function used to determine if
 * a given argument is a window object. It returned true if the
 * object was a window and false otherwise. This function was
 * deprecated in jQuery version 3.3 and has been removed */
$.isWindow = (obj) => {
  /* jshint eqeqeq: false */
  return obj != null && obj === obj.window;
};

/* This function was to check nodes names, but it
 * was documented: https://github.com/jquery/jquery/issues/3475 */
$.nodeName = (elem, name) => {
  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
};

/* The $.isNumeric() method checks whether its argument represents a numeric
 * value. If so, it returns true. Otherwise it returns false.
 * The argument can be of any type. */
$.isNumeric = (obj) => {
  return !Number.isNaN(parseFloat(obj)) && Number.isFinite(obj);
};

/* Return a number representing the current time. */
/* This API has been deprecated in jQuery 3.3; please use the native Date.now() method instead. */
jQuery.now = function () {
  return new Date().getTime();
};

jQuery.parseJSON = function (data) {
  // Attempt to parse using the native JSON parser first
  if (window.JSON && window.JSON.parse) {
    // Support: Android 2.3
    // Workaround failure to string-cast null input
    return window.JSON.parse(`${data}`);
  }

  let requireNonComma;
  let depth = null;
  /* eslint-disable-next-line no-jquery/no-trim */
  const str = jQuery.trim(`${data}`);

  // Guard against invalid (and possibly dangerous) input by ensuring that nothing remains
  // after removing valid tokens

  return str &&
  /* eslint-disable-next-line no-jquery/no-trim */
  !jQuery.trim(
    str.replace(rvalidtokens, function (token, comma, open, close) {
      // Force termination if we see a misplaced comma
      if (requireNonComma && comma) {
        depth = 0;
      }

      // Perform no more replacements after returning to outermost depth
      if (depth === 0) {
        return token;
      }

      // Commas must not follow "[", "{", or ","
      requireNonComma = open || comma;

      // Determine new depth
      // array/object open ("[" or "{"): depth += true - false (increment)
      // array/object close ("]" or "}"): depth += false - true (decrement)
      // other cases ("," or primitive): depth += true - true (numeric cast)
      depth += !close - !open;

      // Remove this token
      return '';
    }),
  )
    ? /* eslint-disable-next-line no-new-func */
    Function(`return ${str}`)()
    : jQuery.error(`Invalid JSON: ${data}`);
};

/* OBJECTS */

jQuery.extend({
  /* cssNumber is an object containing all CSS properties that may be used without a
unit. The .css() method uses this object to see if it may append
px to unitless values.
More information about it and how to use it here: https://jqapi.com/jquery.cssnumber/ */
  cssNumber: {
    animationIterationCount: true,
    columnCount: true,
    fillOpacity: true,
    flexGrow: true,
    flexShrink: true,
    fontWeight: true,
    lineHeight: true,
    opacity: true,
    order: true,
    orphans: true,
    widows: true,
    zIndex: true,
    zoom: true,
  },

  /**
   * jQuery.cssProps is an object used internally by jQuery to handle
   * inconsistencies in CSS property naming across different browsers,
   * particularly older ones. I set it to 'stylefloat' by default */
  cssProps: {
    // normalize float css property
    float: 'styleFloat',
  },
});
