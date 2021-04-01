/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };

    module.exports["default"] = module.exports, module.exports.__esModule = true;
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    module.exports["default"] = module.exports, module.exports.__esModule = true;
  }

  return _typeof(obj);
}

module.exports = _typeof;
module.exports["default"] = module.exports, module.exports.__esModule = true;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2);


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/typeof.js
var helpers_typeof = __webpack_require__(0);
var typeof_default = /*#__PURE__*/__webpack_require__.n(helpers_typeof);

// CONCATENATED MODULE: ./src/scripts/helpers/param.js
/**
 * Get current location search parameter.
 *
 * @param {string} key URL parameter key.
 */
function getSearchParam(key) {
  var params = new URL(document.location.href);
  return params.searchParams.get(key);
}

/* harmony default export */ var param = (getSearchParam);
// CONCATENATED MODULE: ./src/scripts/helpers/attachment.js
/**
 * Upload media frame.
 *
 * @param {string} header Frame header text.
 * @param {Function} callback Callback function.
 */
function uploadMedia(header, callback) {
  var frame = wp.media({
    title: header,
    multiple: false
  });
  frame.on('select', function () {
    var selection = frame.state().get('selection').first().toJSON();

    if (selection.id) {
      callback(selection.id);
    }
  });
  frame.open();
}

/* harmony default export */ var helpers_attachment = (uploadMedia);
// CONCATENATED MODULE: ./src/scripts/helpers/index.js


var Helper = {
  param: param,
  attachment: helpers_attachment
};
/* harmony default export */ var helpers = (Helper);
// CONCATENATED MODULE: ./src/scripts/builders/element.js
/**
 * Helper to create new DOM element.
 *
 * @param {string} tag Element tagname.
 * @param {Object} args List of element options.
 */
function buildElement(tag, args) {
  var element = document.createElement(tag); // Set class list

  if (args.hasOwnProperty('classes')) {
    args.classes.forEach(function (cl) {
      element.classList.add(cl);
    });
  } // Set textContent


  if (args.hasOwnProperty('text')) {
    element.textContent = args.text;
  } // Set innerHTML


  if (args.hasOwnProperty('html')) {
    element.innerHTML = args.html;
  } // Set attributes


  if (args.hasOwnProperty('attributes')) {
    for (var key in args.attributes) {
      element.setAttribute(key, args.attributes[key]);
    }
  } // Set data attributes


  if (args.hasOwnProperty('dataset')) {
    for (var _key in args.dataset) {
      element.setAttribute('data-' + _key, args.dataset[_key]);
    }
  } // Append child


  if (args.hasOwnProperty('append')) {
    args.append.appendChild(element);
  } // Prepend child


  if (args.hasOwnProperty('prepend')) {
    args.prepend.insertBefore(element, args.prepend.firstChild);
  }

  return element;
}

/* harmony default export */ var builders_element = (buildElement);
// CONCATENATED MODULE: ./src/scripts/builders/input.js

/**
 * Helper to create input field.
 *
 * @param {Object} args List of control options.
 * @param {HTMLElement} parent Parent HTML element to append this field.
 */

function buildInput(args, parent) {
  var field = builders_element('div', {
    classes: args.classes || [],
    append: parent
  });

  if (args.hasOwnProperty('label')) {
    builders_element('strong', {
      text: args.label,
      append: field
    });
  }

  var input = builders_element('input', {
    attributes: {
      type: 'text'
    },
    append: field
  }); // Set attributes

  if (args.hasOwnProperty('attributes')) {
    for (var key in args.attributes) {
      input.setAttribute(key, args.attributes[key]);
    }
  }

  return input;
}

/* harmony default export */ var builders_input = (buildInput);
// CONCATENATED MODULE: ./src/scripts/builders/checkbox.js

/**
 * Helper to create radio field.
 *
 * @param {Object} args List of control options.
 * @param {HTMLElement} parent Parent HTML element to append this field.
 */

function buildCheckbox(args, parent) {
  var field = builders_element('label', {
    classes: args.classes || [],
    append: parent
  });
  var checkbox = builders_element('input', {
    attributes: {
      type: 'checkbox'
    },
    append: field
  }); // Set attributes

  if (args.hasOwnProperty('attributes')) {
    for (var key in args.attributes) {
      checkbox.setAttribute(key, args.attributes[key]);
    }
  }

  if (args.hasOwnProperty('checked')) {
    var checked = args.checked;

    if (checked && checked === checkbox.value) {
      checkbox.setAttribute('checked', 'checked');
    }
  }

  if (args.hasOwnProperty('label')) {
    builders_element('span', {
      text: args.label,
      append: field
    });
  }

  return checkbox;
}

/* harmony default export */ var builders_checkbox = (buildCheckbox);
// CONCATENATED MODULE: ./src/scripts/builders/radio.js

/**
 * Helper to create radio field.
 *
 * @param {Object} args List of control options.
 * @param {HTMLElement} parent Parent HTML element to append this field.
 */

function buildRadio(args, parent) {
  var field = builders_element('label', {
    classes: args.classes || [],
    append: parent
  });
  var radio = builders_element('input', {
    attributes: {
      type: 'radio'
    },
    append: field
  }); // Set attributes

  if (args.hasOwnProperty('attributes')) {
    for (var key in args.attributes) {
      radio.setAttribute(key, args.attributes[key]);
    }
  }

  if (args.hasOwnProperty('checked')) {
    var checked = args.checked;

    if (checked && checked === radio.value) {
      radio.setAttribute('checked', 'checked');
    }
  }

  if (args.hasOwnProperty('label')) {
    builders_element('span', {
      text: args.label,
      append: field
    });
  }

  return radio;
}

/* harmony default export */ var builders_radio = (buildRadio);
// CONCATENATED MODULE: ./src/scripts/builders/select.js

/**
 * Helper to create select field.
 *
 * @param {Object} args List of control options.
 * @param {HTMLElement} parent Parent HTML element to append this field.
 */

function buildSelect(args, parent) {
  var field = builders_element('div', {
    classes: args.classes || [],
    append: parent
  });

  if (args.hasOwnProperty('label')) {
    builders_element('strong', {
      text: args.label,
      append: field
    });
  }

  var select = builders_element('select', {
    append: field
  }); // Set attributes

  if (args.hasOwnProperty('attributes')) {
    for (var key in args.attributes) {
      select.setAttribute(key, args.attributes[key]);
    }
  }

  var options = args.options || {};

  for (var _key in options) {
    var option = builders_element('option', {
      text: options[_key],
      attributes: {
        value: _key
      },
      append: select
    });

    if (args.hasOwnProperty('selected')) {
      var selected = args.selected;

      if (selected && selected === option.value) {
        option.setAttribute('selected', 'selected');
      }
    }
  }

  return select;
}

/* harmony default export */ var builders_select = (buildSelect);
// CONCATENATED MODULE: ./src/scripts/builders/textarea.js

/**
 * Helper to create input field.
 *
 * @param {Object} args List of control options.
 * @param {HTMLElement} parent Parent HTML element to append this field.
 */

function buildTextarea(args, parent) {
  var field = builders_element('div', {
    classes: args.classes || [],
    append: parent
  });

  if (args.hasOwnProperty('label')) {
    builders_element('strong', {
      text: args.label,
      append: field
    });
  }

  var textarea = builders_element('textarea', {
    append: field
  }); // Set attributes

  if (args.hasOwnProperty('attributes')) {
    for (var key in args.attributes) {
      textarea.setAttribute(key, args.attributes[key]);
    }
  } // Set content


  if (args.hasOwnProperty('content')) {
    textarea.innerHTML = args.content;
  }

  return textarea;
}

/* harmony default export */ var builders_textarea = (buildTextarea);
// CONCATENATED MODULE: ./src/scripts/builders/control.js






/**
 * Helper to create control.
 *
 * @param {Object} args List of control options.
 */

function buildControl(args) {
  var control = builders_element('div', {
    classes: args.classes || []
  });

  if (args.hasOwnProperty('append')) {
    args.append.appendChild(control);
  }

  if (args.hasOwnProperty('prepend')) {
    args.prepend.insertBefore(control, args.prepend.firstChild);
  }

  if (args.hasOwnProperty('label')) {
    builders_element('strong', {
      text: args.label,
      append: control
    });
  }

  if (args.hasOwnProperty('description')) {
    builders_element('p', {
      text: args.description,
      append: control
    });
  }

  if (args.hasOwnProperty('fields')) {
    args.fields.forEach(function (field) {
      switch (field.group) {
        case 'input':
          builders_input(field, control);
          break;

        case 'textarea':
          builders_textarea(field, control);
          break;

        case 'radio':
          builders_radio(field, control);
          break;

        case 'select':
          builders_select(field, control);
          break;

        case 'checkbox':
          builders_checkbox(field, control);
          break;
      }
    });
  }

  if (args.hasOwnProperty('help')) {
    builders_element('small', {
      text: args.help,
      append: control
    });
  }

  return control;
}

/* harmony default export */ var builders_control = (buildControl);
// CONCATENATED MODULE: ./src/scripts/builders/layer.js

/**
 * Helper to create layer.
 *
 * @param {Object} args List of layer options.
 */

function buildLayer(args) {
  var layer = builders_element('div', {
    classes: args.classes || []
  });

  if (args.hasOwnProperty('append')) {
    args.append.appendChild(layer);
  }

  if (args.hasOwnProperty('prepend')) {
    args.prepend.insertBefore(layer, args.prepend.firstChild);
  }

  if (args.hasOwnProperty('label')) {
    builders_element('h3', {
      text: args.label,
      append: layer
    });
  }

  if (args.hasOwnProperty('description')) {
    builders_element('h5', {
      text: args.description,
      append: layer
    });
  }

  return layer;
}

/* harmony default export */ var builders_layer = (buildLayer);
// CONCATENATED MODULE: ./src/scripts/builders/media.js



/**
 * Helper to create media block.
 *
 * @param {Object} args List of media options.
 */

function buildMedia(args) {
  var media = builders_control({
    classes: args.classes || []
  });

  if (args.hasOwnProperty('append')) {
    args.append.appendChild(media);
  }

  if (args.hasOwnProperty('prepend')) {
    args.prepend.insertBefore(media, args.prepend.firstChild);
  } // Labels are required.


  args.labels = args.labels || {};
  var attachment = builders_element('input', {
    attributes: {
      type: 'hidden',
      name: args.name
    },
    append: media
  });
  var upload = builders_element('button', {
    classes: ['button'],
    text: args.labels.button,
    attributes: {
      type: 'button'
    },
    append: media
  });
  var details = builders_element('a', {
    classes: ['hidden'],
    text: args.labels.details,
    attributes: {
      target: '_blank'
    },
    append: media
  }); // Helper function to update attachment value.

  var setAttachment = function setAttachment(id) {
    attachment.setAttribute('value', id);
    attachment.dispatchEvent(new Event('change', {
      bubbles: true
    }));
    var link = new URL(args.link);
    link.searchParams.set('item', id);
    details.setAttribute('href', link);
    details.classList.remove('hidden');
  }; // Update fields if this layer has attachment.


  if (args.value) {
    setAttachment(args.value);
  }

  upload.addEventListener('click', function () {
    helpers.attachment(args.labels.heading, function (id) {
      setAttachment(id);
    });
  });
  return media;
}

/* harmony default export */ var builders_media = (buildMedia);
// CONCATENATED MODULE: ./src/scripts/builders/index.js









var Build = {
  element: builders_element,
  control: builders_control,
  layer: builders_layer,
  checkbox: builders_checkbox,
  media: builders_media,
  input: builders_input,
  textareal: builders_textarea,
  radio: builders_radio,
  select: builders_select
};
/* harmony default export */ var builders = (Build);
// CONCATENATED MODULE: ./src/scripts/sections/catalog.js

var __ = wp.i18n.__;
/**
 * Create template card in catalog.
 *
 * @param {HTMLElement} form Form HTML element.
 * @param {number} index Current card index.
 * @param {Object} option List of template options.
 */

function createCard(form, index, option) {
  var card = builders.element('div', {
    classes: ['sharing-image-catalog-card'],
    append: form
  });
  var preview = builders.element('figure', {
    classes: ['sharing-image-catalog-preview'],
    append: card
  });

  if (option.preview) {
    builders.element('img', {
      attributes: {
        src: option.preview,
        alt: ''
      },
      append: preview
    });
  }

  var footer = builders.element('footer', {
    classes: ['sharing-image-catalog-footer'],
    append: card
  });
  builders.element('h2', {
    text: option.title || __('Untitled', 'sharing-image'),
    append: footer
  });
  var link = new URL(document.location.href);
  link.searchParams.set('template', index);
  builders.element('a', {
    classes: ['button'],
    text: __('Edit template', 'sharing-image'),
    attributes: {
      href: link
    },
    append: footer
  });
}
/**
 * Create new template button in catalog.
 *
 * @param {HTMLElement} form Form HTML element.
 * @param {number} index New card index.
 */


function createNewButton(form, index) {
  var link = new URL(document.location.href);
  link.searchParams.set('template', index);
  var button = builders.element('a', {
    classes: ['sharing-image-catalog-new'],
    attributes: {
      href: link
    },
    append: form
  });
  builders.element('h2', {
    text: __('Add new template', 'sharing-image'),
    append: button
  });
}
/**
 * Create templates catalog from options.
 *
 * @param {HTMLElement} form Settings form element.
 * @param {Object} settings Global settings field.
 */


function createCatalog(form, settings) {
  form.classList.add('sharing-image-catalog');
  var index = 1;
  settings.templates.forEach(function (template) {
    createCard(form, index++, template);
  });
  createNewButton(form, index);
}

/* harmony default export */ var catalog = (createCatalog);
// CONCATENATED MODULE: ./src/scripts/sections/editor.js
/**
 * editor settings.
 */

/* global ajaxurl:true */

var editor_ = wp.i18n.__; // Store global settings for template editor.

var params = null; // Preview element.

var editor_preview = null;
/**
 * Show template warning message.
 *
 * @param {string} message Warning message.
 */

function showTemplateError(message) {
  var viewport = editor_preview.parentNode; // Try to find warning element.

  var warning = viewport.querySelector('.sharing-image-editor-warning');
  warning.classList.add('warning-visible');
  warning.textContent = message || editor_('Unknown generation error', 'sharing-image');
}
/**
 * Remove warning message block.
 */


function hideTemplateError() {
  var viewport = editor_preview.parentNode; // Try to find warning element.

  var warning = viewport.querySelector('.sharing-image-editor-warning');

  if (null !== warning) {
    warning.classList.remove('warning-visible');
  }
}
/**
 * Geneate template using form data.
 *
 * @param {HTMLElement} form Settings form element.
 */


function generateTemplate(form) {
  var request = new XMLHttpRequest();
  request.open('POST', ajaxurl);
  request.responseType = 'blob';
  editor_preview.classList.add('preview-loader'); // Create data bundle using form data.

  var bundle = new window.FormData(form);
  bundle.set('action', 'sharing-image-show');
  hideTemplateError(); // Set blob for success response.

  request.onreadystatechange = function () {
    if (request.readyState === 2) {
      request.responseType = 'blob';

      if (request.status !== 200) {
        request.responseType = 'json';
      }
    }
  }; // Hide preview loader on request complete.


  request.onreadystatechange = function () {
    if (request.readyState === 4) {
      editor_preview.classList.remove('preview-blank', 'preview-loader');
    }
  };

  request.onload = function () {
    var response = request.response || {};

    if (request.status !== 200) {
      return showTemplateError(response.data);
    }

    var image = editor_preview.querySelector('img');

    if (null === image) {
      image = builders.element('img', {
        append: editor_preview
      });
    } // Set new blob image source.


    image.src = window.URL.createObjectURL(response);
  };

  request.onerror = function () {
    showTemplateError();
  };

  request.send(bundle);
}
/**
 * Save template while form submiting.
 *
 * @param {HTMLElement} form Settings form element.
 */


function saveTemplate(form) {
  var request = new XMLHttpRequest();
  request.open('POST', ajaxurl);
  request.responseType = 'json';
  editor_preview.classList.add('preview-loader'); // Create data bundle using form data.

  var bundle = new window.FormData(form);
  bundle.set('action', 'sharing-image-save');

  request.onload = function () {
    var response = request.response || {};

    if (request.status !== 200) {
      return showTemplateError(response.data);
    }

    var field = editor_preview.querySelector('input');

    if (null !== field) {
      field.value = response.data || '';
    }

    form.submit();
  };

  request.onerror = function () {
    showTemplateError();
  };

  request.send(bundle);
}
/**
 * Update form fields name attributes for layers
 *
 * @param {HTMLElement} designer Layouts designer element.
 */


function reorderLayers(designer) {
  var layers = designer.children;

  var _loop = function _loop(index) {
    var fields = layers[index].querySelectorAll('[name]');
    fields.forEach(function (field) {
      var name = field.getAttribute('name'); // Try to find layer index.

      var match = name.match(/(.+?\[layers\])\[(\d+)\](\[.+?\])$/);

      if (null !== match) {
        name = match[1] + "[".concat(index, "]") + match[3];
      }

      field.setAttribute('name', name);
    });
  };

  for (var index = 0; index < layers.length; index++) {
    _loop(index);
  }
}
/**
 * Update template background settings with custom logic.
 *
 * @param {HTMLElement} fieldset Fieldset HTML element.
 * @param {Object} data Current template data.
 */


function createPermanentAttachment(fieldset, data) {
  data.background = data.background || null; // Create background settings control.

  var control = builders.control({
    classes: ['sharing-image-editor-control', 'control-half-bottom'],
    label: editor_('Template background settings', 'sharing-image'),
    fields: [{
      group: 'radio',
      classes: ['sharing-image-editor-radio'],
      attributes: {
        name: params.name + '[background]',
        value: 'dynamic'
      },
      label: editor_('Select for each post separately', 'sharing-image'),
      checked: data.background
    }, {
      group: 'radio',
      classes: ['sharing-image-editor-radio'],
      attributes: {
        name: params.name + '[background]',
        value: 'thumbnail'
      },
      label: editor_('Use post thumbnail image', 'sharing-image'),
      checked: data.background
    }, {
      group: 'radio',
      classes: ['sharing-image-editor-radio'],
      attributes: {
        name: params.name + '[background]',
        value: 'permanent'
      },
      label: editor_('Upload permanent background', 'sharing-image'),
      checked: data.background
    }],
    append: fieldset
  });
  params.links = params.links || {};
  var media = builders.media({
    name: params.name + '[attachment]',
    classes: ['sharing-image-editor-control', 'control-details'],
    value: data.attachment || '',
    link: params.links.uploads,
    labels: {
      button: editor_('Upload image', 'sharing-image'),
      heading: editor_('Select layer image', 'sharing-image'),
      details: editor_('Attachment details', 'sharing-image')
    },
    append: fieldset
  });
  var upload = media.querySelector('button');
  upload.setAttribute('disabled', 'disabled'); // Get checked background radio input.

  var fields = control.querySelectorAll('input');
  fields.forEach(function (input) {
    // Show button for checked permanent radio.
    if (input.checked && 'permanent' === input.value) {
      upload.removeAttribute('disabled', 'disabled');
    }

    input.addEventListener('change', function () {
      upload.setAttribute('disabled', 'disabled');

      if ('permanent' === input.value) {
        upload.removeAttribute('disabled');
      }
    });
  });
}
/**
 * Text layer dynamic/static fields manager.
 *
 * @param {HTMLElement} layer Current layer element.
 * @param {string} name Fields name attribute prefix.
 * @param {Object} data Layer data object.
 */


function createDynamicFields(layer, name, data) {
  var control = builders.control({
    classes: ['sharing-image-editor-control'],
    append: layer
  });
  var checkbox = builders.checkbox({
    classes: ['sharing-image-editor-checkbox'],
    attributes: {
      name: name + '[dynamic]',
      value: 'dynamic'
    },
    label: editor_('Dynamic field. Filled in the post editing screen.', 'sharing-image'),
    checked: data.dynamic
  }, control);
  var fields = [];
  fields[fields.length] = builders.control({
    classes: ['sharing-image-editor-control', 'control-hidden'],
    help: editor_('Displayed only in the metabox.', 'sharing-image'),
    fields: [{
      group: 'input',
      classes: ['sharing-image-editor-input'],
      attributes: {
        name: name + '[title]',
        value: data.title || ''
      },
      label: editor_('Field name', 'sharing-image')
    }],
    append: layer
  });
  fields[fields.length] = builders.control({
    classes: ['sharing-image-editor-control', 'control-hidden'],
    help: editor_('This field is used for example only, to see how the editor will look.', 'sharing-image'),
    fields: [{
      group: 'textarea',
      classes: ['sharing-image-editor-textarea'],
      content: data.sample || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      attributes: {
        name: name + '[sample]',
        rows: 2
      },
      label: editor_('Text sample', 'sharing-image')
    }],
    append: layer
  });
  fields[fields.length] = builders.control({
    classes: ['sharing-image-editor-control', 'control-hidden'],
    label: editor_('Preset text field', 'sharing-image'),
    fields: [{
      group: 'radio',
      classes: ['sharing-image-editor-radio'],
      attributes: {
        name: name + '[preset]',
        value: 'none'
      },
      label: editor_('Fill in manually', 'sharing-image'),
      checked: data.preset || 'none'
    }, {
      group: 'radio',
      classes: ['sharing-image-editor-radio'],
      attributes: {
        name: name + '[preset]',
        value: 'title'
      },
      label: editor_('Take from post title', 'sharing-image'),
      checked: data.preset || 'none'
    }, {
      group: 'radio',
      classes: ['sharing-image-editor-radio'],
      attributes: {
        name: name + '[preset]',
        value: 'excerpt'
      },
      label: editor_('Use post excerpt text', 'sharing-image'),
      checked: data.preset || 'none'
    }],
    append: layer
  });
  fields[fields.length] = builders.control({
    classes: ['sharing-image-editor-control'],
    help: editor_('You can use non-breaking spaces to manage your string position.', 'sharing-image'),
    fields: [{
      group: 'textarea',
      classes: ['sharing-image-editor-textarea'],
      content: data.inscription || '',
      attributes: {
        name: name + '[inscription]',
        rows: 2
      },
      label: editor_('Inscription', 'sharing-image')
    }],
    append: layer
  }); // Helper function to toggle contols visibility.

  var toggleClasses = function toggleClasses() {
    fields.forEach(function (field) {
      field.classList.toggle('control-hidden');
    });
  };

  if (checkbox.checked) {
    toggleClasses();
  }

  checkbox.addEventListener('change', function () {
    toggleClasses();
  });
}
/**
 * Text layer more options fields manager.
 *
 * @param {HTMLElement} layer Current layer element.
 * @param {string} name Fields name attribute prefix.
 * @param {Object} data Layer data object.
 */


function createMoreFields(layer, name, data) {
  var fields = [];
  fields[fields.length] = builders.control({
    classes: ['sharing-image-editor-control', 'control-single', 'control-hidden'],
    fields: [{
      group: 'select',
      classes: ['sharing-image-editor-select'],
      options: {
        opensans: 'Open Sans',
        roboto: 'Roboto',
        montserrat: 'Montserrat',
        merriweather: 'Merriweather',
        alice: 'Alice'
      },
      attributes: {
        name: name + '[font]'
      },
      label: editor_('Font family', 'sharing-image'),
      selected: data.font
    }],
    append: layer
  });
  fields[fields.length] = builders.control({
    classes: ['sharing-image-editor-control', 'control-single', 'control-hidden'],
    fields: [{
      group: 'input',
      classes: ['sharing-image-editor-color'],
      attributes: {
        type: 'color',
        name: name + '[color]',
        value: data.color || '#cccccc'
      },
      label: editor_('Color', 'sharing-image')
    }],
    append: layer
  });
  fields[fields.length] = builders.control({
    classes: ['sharing-image-editor-control', 'control-double', 'control-hidden'],
    fields: [{
      group: 'select',
      classes: ['sharing-image-editor-select'],
      options: {
        left: editor_('Left', 'sharing-image'),
        center: editor_('Center', 'sharing-image'),
        right: editor_('Right', 'sharing-image')
      },
      attributes: {
        name: name + '[horizontal]'
      },
      label: editor_('Horizontal alignment', 'sharing-image'),
      selected: data.horizontal
    }, {
      group: 'select',
      classes: ['sharing-image-editor-select'],
      options: {
        top: editor_('Top', 'sharing-image'),
        center: editor_('Center', 'sharing-image'),
        bottom: editor_('Bottom', 'sharing-image')
      },
      attributes: {
        name: name + '[vertical]'
      },
      label: editor_('Vertical alignment', 'sharing-image'),
      selected: data.vertical
    }],
    append: layer
  });
  var control = builders.control({
    classes: ['sharing-image-editor-control'],
    append: layer
  });
  var button = builders.element('button', {
    classes: ['sharing-image-editor-more'],
    text: editor_('More options', 'sharing-image'),
    attributes: {
      type: 'button'
    },
    append: control
  });
  button.addEventListener('click', function () {
    fields.forEach(function (field) {
      field.classList.remove('control-hidden');
    }); // Remove button on expand.

    layer.removeChild(control);
  });
}
/**
 * Create catalog button in footer.
 *
 * @param {HTMLElement} footer Footer HTML element.
 */


function createCatalogButton(footer) {
  var link = new URL(document.location.href);
  link.searchParams.delete('template');
  builders.element('a', {
    classes: ['button'],
    text: editor_('← Back to Catalog', 'sharing-image'),
    attributes: {
      href: link
    },
    append: footer
  });
}
/**
 * Create template deletion button in footer.
 *
 * @param {HTMLElement} form Form HTML element.
 * @param {HTMLElement} footer Footer HTML element.
 */


function createDeleteButton(form, footer) {
  params.links = params.links || {};
  var href = new URL(document.location.href); // Get template index from current link.

  var index = href.searchParams.get('template'); // Set template index to delete link.

  var link = new URL(form.action);
  link.searchParams.set('action', 'sharing-image-delete');
  link.searchParams.set('template', index);
  link.searchParams.set('nonce', params.nonce);
  builders.element('a', {
    classes: ['sharing-image-editor-delete'],
    text: editor_('Delete template', 'sharing-image'),
    attributes: {
      href: link
    },
    append: footer
  });
}
/**
 * Create preview element.
 *
 * @param {HTMLElement} viewport Monitor viewport element.
 * @param {Object} data Template data object.
 */


function createPreview(viewport, data) {
  editor_preview = builders.element('div', {
    classes: ['sharing-image-editor-preview', 'preview-blank'],
    append: viewport
  });

  if (data.preview) {
    builders.element('img', {
      attributes: {
        src: data.preview,
        alt: ''
      },
      append: editor_preview
    });
    editor_preview.classList.remove('preview-blank');
  }

  builders.element('span', {
    classes: ['sharing-image-editor-loader'],
    append: editor_preview
  });
  builders.element('input', {
    attributes: {
      type: 'hidden',
      name: params.name + '[preview]',
      value: data.preview || ''
    },
    append: editor_preview
  });
  return editor_preview;
}
/**
 * Create button inside layer box to change order.
 *
 * @param {HTMLElement} designer Layers designer HTML element.
 * @param {HTMLElement} layer Current layer HTML emelemt.
 */


function createOrderLayersButton(designer, layer) {
  var button = builders.element('button', {
    classes: ['sharing-image-editor-order'],
    attributes: {
      type: 'button',
      title: editor_('Raise higher', 'sharing-image')
    },
    append: layer
  });
  button.addEventListener('click', function () {
    if (layer.previousSibling) {
      designer.insertBefore(layer, layer.previousSibling);
    }

    reorderLayers(designer);
  });
}
/**
 * Create button to delete layer.
 *
 * @param {HTMLElement} designer Layers designer HTML element.
 * @param {HTMLElement} layer Current layer HTML emelemt.
 */


function createDeleteLayerButton(designer, layer) {
  var control = builders.control({
    classes: ['sharing-image-editor-control', 'control-footer'],
    append: layer
  });
  var button = builders.element('button', {
    classes: ['sharing-image-editor-delete'],
    text: editor_('Delete layer', 'sharing-image'),
    attributes: {
      type: 'button'
    },
    append: control
  });
  button.addEventListener('click', function () {
    designer.removeChild(layer);
    reorderLayers(designer);
  });
}
/**
 * Create image layer.
 *
 * @param {number} index Current layer index.
 * @param {Object} data Current template layer data.
 */


function createLayerImage(index, data) {
  var description = [];
  description.push(editor_('Use jpg, gif or png image formats.', 'sharing-image'));
  description.push(editor_('All sizes can be set in pixels or percentages. ', 'sharing-image'));
  var layer = builders.layer({
    classes: ['sharing-image-editor-layer', 'layer-image'],
    label: editor_('Image', 'sharing-image'),
    description: description.join(' ')
  }); // Form fields name for this layer.

  var name = params.name + "[layers][".concat(index, "]");
  builders.element('input', {
    attributes: {
      type: 'hidden',
      name: name + '[type]',
      value: 'image'
    },
    append: layer
  });
  params.links = params.links || {};
  builders.media({
    name: name + '[attachment]',
    classes: ['sharing-image-editor-control', 'control-details'],
    value: data.attachment || '',
    link: params.links.uploads,
    labels: {
      button: editor_('Upload image', 'sharing-image'),
      heading: editor_('Select layer image', 'sharing-image'),
      details: editor_('Attachment details', 'sharing-image')
    },
    append: layer
  });
  builders.control({
    classes: ['sharing-image-editor-control', 'control-grid'],
    fields: [{
      group: 'input',
      classes: ['sharing-image-editor-input'],
      attributes: {
        name: name + '[x]',
        placeholder: '50%',
        value: data.x || ''
      },
      label: editor_('X starting point', 'sharing-image')
    }, {
      group: 'input',
      classes: ['sharing-image-editor-input'],
      attributes: {
        name: name + '[y]',
        placeholder: '20',
        value: data.y || ''
      },
      label: editor_('Y starting point', 'sharing-image')
    }, {
      group: 'input',
      classes: ['sharing-image-editor-input'],
      attributes: {
        name: name + '[width]',
        placeholder: '100',
        value: data.width || ''
      },
      label: editor_('Width', 'sharing-image')
    }, {
      group: 'input',
      classes: ['sharing-image-editor-input'],
      attributes: {
        name: name + '[height]',
        placeholder: '100',
        value: data.height || ''
      },
      label: editor_('Height', 'sharing-image')
    }],
    append: layer
  });
  return layer;
}
/**
 * Create text layer.
 *
 * @param {number} index Current layer index.
 * @param {Object} data Current template data.
 */


function createLayerText(index, data) {
  var description = [];
  description.push(editor_('Write a text to the current image.', 'sharing-image'));
  description.push(editor_('If the font does not fit within your limits, its size will decrease.', 'sharing-image'));
  var layer = builders.layer({
    classes: ['sharing-image-editor-layer', 'layer-text'],
    label: editor_('Text', 'sharing-image'),
    description: description.join(' ')
  }); // Form fields name for this layer.

  var name = params.name + "[layers][".concat(index, "]");
  builders.element('input', {
    attributes: {
      type: 'hidden',
      name: name + '[type]',
      value: 'text'
    },
    append: layer
  });
  builders.control({
    classes: ['sharing-image-editor-control', 'control-grid'],
    fields: [{
      group: 'input',
      classes: ['sharing-image-editor-input'],
      attributes: {
        type: 'text',
        name: name + '[x]',
        value: data.x || '',
        placeholder: '10'
      },
      label: editor_('X starting point', 'sharing-image')
    }, {
      group: 'input',
      classes: ['sharing-image-editor-input'],
      attributes: {
        type: 'text',
        name: name + '[y]',
        value: data.y || '',
        placeholder: '10'
      },
      label: editor_('Y starting point', 'sharing-image')
    }, {
      group: 'input',
      classes: ['sharing-image-editor-input'],
      attributes: {
        type: 'text',
        name: name + '[width]',
        value: data.width || '',
        placeholder: '100'
      },
      label: editor_('Width', 'sharing-image')
    }, {
      group: 'input',
      classes: ['sharing-image-editor-input'],
      attributes: {
        type: 'text',
        name: name + '[height]',
        value: data.height || '',
        placeholder: '100'
      },
      label: editor_('Height', 'sharing-image')
    }],
    append: layer
  }); // Create static/dynamic text fields.

  createDynamicFields(layer, name, data); // Create more options.

  createMoreFields(layer, name, data);
  builders.control({
    classes: ['sharing-image-editor-control', 'control-double'],
    fields: [{
      group: 'input',
      classes: ['sharing-image-editor-range'],
      attributes: {
        type: 'range',
        name: name + '[fontsize]',
        min: 10,
        max: 200,
        step: 1,
        value: data.fontsize || '48'
      },
      label: editor_('Font size', 'sharing-image')
    }, {
      group: 'input',
      classes: ['sharing-image-editor-range'],
      attributes: {
        type: 'range',
        name: name + '[lineheight]',
        min: 0,
        max: 4,
        step: 0.25,
        value: data.lineheight || '1.5'
      },
      label: editor_('Line height', 'sharing-image')
    }],
    append: layer
  });
  return layer;
}
/**
 * Create filter layer.
 *
 * @param {number} index Current layer index.
 * @param {Object} data Current template data.
 */


function createLayerFilter(index, data) {
  var description = [];
  description.push(editor_('Filters are applied one after another to the entire editor image.', 'sharing-image'));
  description.push(editor_('If you want to control their order, create multiple layers.', 'sharing-image'));
  var layer = builders.layer({
    classes: ['sharing-image-editor-layer', 'layer-text'],
    label: editor_('Filter', 'sharing-image'),
    description: description.join(' ')
  }); // Form fields name for this layer.

  var name = params.name + "[layers][".concat(index, "]");
  builders.element('input', {
    attributes: {
      type: 'hidden',
      name: name + '[type]',
      value: 'filter'
    },
    append: layer
  });
  builders.control({
    classes: ['sharing-image-editor-control'],
    fields: [{
      group: 'checkbox',
      classes: ['sharing-image-editor-checkbox'],
      attributes: {
        name: name + '[grayscale]',
        value: 'grayscale'
      },
      label: editor_('Turns image into a grayscale version', 'sharing-image'),
      checked: data.grayscale
    }],
    append: layer
  });
  builders.control({
    classes: ['sharing-image-editor-control'],
    fields: [{
      group: 'input',
      classes: ['sharing-image-editor-range'],
      attributes: {
        type: 'range',
        name: name + '[brightness]',
        min: -255,
        max: 255,
        step: 10,
        value: data.brightness || '0'
      },
      label: editor_('Brightness', 'sharing-image')
    }],
    append: layer
  });
  builders.control({
    classes: ['sharing-image-editor-control'],
    fields: [{
      group: 'input',
      classes: ['sharing-image-editor-range'],
      attributes: {
        type: 'range',
        name: name + '[contrast]',
        min: -100,
        max: 100,
        step: 10,
        value: data.contrast || '0'
      },
      label: editor_('Contrast', 'sharing-image')
    }],
    append: layer
  });
  return layer;
}
/**
 * Create line layer.
 *
 * @param {number} index Current layer index.
 * @param {Object} data Current template data.
 */


function createLayerLine(index, data) {
  var description = [];
  description.push(editor_('Draw a line from x,y starting point to x,y end point on current image.', 'sharing-image'));
  description.push(editor_('Use rectangle layer to draw a line with a variable width.', 'sharing-image'));
  var layer = builders.layer({
    classes: ['sharing-image-editor-layer', 'layer-text'],
    label: editor_('Line', 'sharing-image'),
    description: description.join(' ')
  }); // Form fields name for this layer.

  var name = params.name + "[layers][".concat(index, "]");
  builders.element('input', {
    attributes: {
      type: 'hidden',
      name: name + '[type]',
      value: 'line'
    },
    append: layer
  });
  builders.control({
    classes: ['sharing-image-editor-control', 'control-single'],
    fields: [{
      group: 'input',
      classes: ['sharing-image-editor-color'],
      attributes: {
        type: 'color',
        name: name + '[color]',
        value: data.color || '#cccccc'
      },
      label: editor_('Line color', 'sharing-image')
    }],
    append: layer
  });
  builders.control({
    classes: ['sharing-image-editor-control', 'control-grid'],
    fields: [{
      group: 'input',
      classes: ['sharing-image-editor-input'],
      attributes: {
        type: 'text',
        name: name + '[x1]',
        value: data.y1 || '',
        placeholder: '10'
      },
      label: editor_('X starting point', 'sharing-image')
    }, {
      group: 'input',
      classes: ['sharing-image-editor-input'],
      attributes: {
        type: 'text',
        name: name + '[y1]',
        value: data.y1 || '',
        placeholder: '10'
      },
      label: editor_('Y starting point', 'sharing-image')
    }, {
      group: 'input',
      classes: ['sharing-image-editor-input'],
      attributes: {
        type: 'text',
        name: name + '[x2]',
        value: data.x2 || '',
        placeholder: '100'
      },
      label: editor_('X end point', 'sharing-image')
    }, {
      group: 'input',
      classes: ['sharing-image-editor-input'],
      attributes: {
        type: 'text',
        name: name + '[y2]',
        value: data.y2 || '',
        placeholder: '10'
      },
      label: editor_('Y end point', 'sharing-image')
    }],
    append: layer
  });
  builders.control({
    classes: ['sharing-image-editor-control'],
    fields: [{
      group: 'checkbox',
      classes: ['sharing-image-editor-checkbox'],
      attributes: {
        name: name + '[dashed]',
        value: 'dashed'
      },
      label: editor_('Draw a dashed line', 'sharing-image'),
      checked: data.dashed
    }],
    append: layer
  });
  builders.control({
    classes: ['sharing-image-editor-control'],
    fields: [{
      group: 'input',
      classes: ['sharing-image-editor-range'],
      attributes: {
        type: 'range',
        name: name + '[opacity]',
        min: 0,
        max: 1,
        step: 0.05,
        value: data.opacity || '0'
      },
      label: editor_('Opacity', 'sharing-image')
    }],
    append: layer
  });
  return layer;
}
/**
 * Create rectangle layer.
 *
 * @param {number} index Current layer index.
 * @param {Object} data Current template data.
 */


function createLayerRectangle(index, data) {
  var description = [];
  description.push(editor_('Draw a colored rectangle on current image.', 'sharing-image'));
  description.push(editor_('You can get filled or outlined figure with custom color and opacity.', 'sharing-image'));
  var layer = builders.layer({
    classes: ['sharing-image-editor-layer', 'layer-text'],
    label: editor_('Rectangle', 'sharing-image'),
    description: description.join(' ')
  }); // Form fields name for this layer.

  var name = params.name + "[layers][".concat(index, "]");
  builders.element('input', {
    attributes: {
      type: 'hidden',
      name: name + '[type]',
      value: 'rectangle'
    },
    append: layer
  });
  builders.control({
    classes: ['sharing-image-editor-control', 'control-single'],
    fields: [{
      group: 'input',
      classes: ['sharing-image-editor-color'],
      attributes: {
        type: 'color',
        name: name + '[color]',
        value: data.color || '#cccccc'
      },
      label: editor_('Rectangle color', 'sharing-image')
    }],
    append: layer
  });
  builders.control({
    classes: ['sharing-image-editor-control', 'control-grid'],
    fields: [{
      group: 'input',
      classes: ['sharing-image-editor-input'],
      attributes: {
        type: 'text',
        name: name + '[x]',
        value: data.x || '',
        placeholder: '10'
      },
      label: editor_('X starting point', 'sharing-image')
    }, {
      group: 'input',
      classes: ['sharing-image-editor-input'],
      attributes: {
        type: 'text',
        name: name + '[y]',
        value: data.y || '',
        placeholder: '10'
      },
      label: editor_('Y starting point', 'sharing-image')
    }, {
      group: 'input',
      classes: ['sharing-image-editor-input'],
      attributes: {
        type: 'text',
        name: name + '[width]',
        value: data.width || '',
        placeholder: '100'
      },
      label: editor_('Width', 'sharing-image')
    }, {
      group: 'input',
      classes: ['sharing-image-editor-input'],
      attributes: {
        type: 'text',
        name: name + '[height]',
        value: data.height || '',
        placeholder: '100'
      },
      label: editor_('Height', 'sharing-image')
    }],
    append: layer
  });
  builders.control({
    classes: ['sharing-image-editor-control'],
    fields: [{
      group: 'checkbox',
      classes: ['sharing-image-editor-checkbox'],
      attributes: {
        name: name + '[outline]',
        value: 'outline'
      },
      label: editor_('Outline rectangle', 'sharing-image'),
      checked: data.outline
    }],
    append: layer
  });
  builders.control({
    classes: ['sharing-image-editor-control'],
    fields: [{
      group: 'input',
      classes: ['sharing-image-editor-range'],
      attributes: {
        type: 'range',
        name: name + '[opacity]',
        min: 0,
        max: 1,
        step: 0.05,
        value: data.opacity || '0'
      },
      label: editor_('Opacity', 'sharing-image')
    }],
    append: layer
  });
  return layer;
}
/**
 * Create ellipse layer.
 *
 * @param {number} index Current layer index.
 * @param {Object} data Current template data.
 */


function createLayerEllipse(index, data) {
  var description = [];
  description.push(editor_('Draw a colored ellipse at given x,y center coordinates and size.', 'sharing-image'));
  description.push(editor_('You can get filled or outlined figure with custom color and opacity.', 'sharing-image'));
  var layer = builders.layer({
    classes: ['sharing-image-editor-layer', 'layer-text'],
    label: editor_('Ellipse', 'sharing-image'),
    description: description.join(' ')
  }); // Form fields name for this layer.

  var name = params.name + "[layers][".concat(index, "]");
  builders.element('input', {
    attributes: {
      type: 'hidden',
      name: name + '[type]',
      value: 'ellipse'
    },
    append: layer
  });
  builders.control({
    classes: ['sharing-image-editor-control', 'control-single'],
    fields: [{
      group: 'input',
      classes: ['sharing-image-editor-color'],
      attributes: {
        type: 'color',
        name: name + '[color]',
        value: data.color || '#cccccc'
      },
      label: editor_('Ellipse color', 'sharing-image')
    }],
    append: layer
  });
  builders.control({
    classes: ['sharing-image-editor-control', 'control-grid'],
    fields: [{
      group: 'input',
      classes: ['sharing-image-editor-input'],
      attributes: {
        type: 'text',
        name: name + '[x]',
        value: data.x || '',
        placeholder: '10'
      },
      label: editor_('X center point', 'sharing-image')
    }, {
      group: 'input',
      classes: ['sharing-image-editor-input'],
      attributes: {
        type: 'text',
        name: name + '[y]',
        value: data.y || '',
        placeholder: '10'
      },
      label: editor_('Y center point', 'sharing-image')
    }, {
      group: 'input',
      classes: ['sharing-image-editor-input'],
      attributes: {
        type: 'text',
        name: name + '[width]',
        value: data.width || '',
        placeholder: '100'
      },
      label: editor_('Width', 'sharing-image')
    }, {
      group: 'input',
      classes: ['sharing-image-editor-input'],
      attributes: {
        type: 'text',
        name: name + '[height]',
        value: data.height || '',
        placeholder: '100'
      },
      label: editor_('Height', 'sharing-image')
    }],
    append: layer
  });
  builders.control({
    classes: ['sharing-image-editor-control'],
    fields: [{
      group: 'checkbox',
      classes: ['sharing-image-editor-checkbox'],
      attributes: {
        name: name + '[outline]',
        value: 'outline'
      },
      label: editor_('Outline ellipse', 'sharing-image'),
      checked: data.outline
    }],
    append: layer
  });
  builders.control({
    classes: ['sharing-image-editor-control'],
    fields: [{
      group: 'input',
      classes: ['sharing-image-editor-range'],
      attributes: {
        type: 'range',
        name: name + '[opacity]',
        min: 0,
        max: 1,
        step: 0.05,
        value: data.opacity || '0'
      },
      label: editor_('Opacity', 'sharing-image')
    }],
    append: layer
  });
  return layer;
}
/**
 * Create new layer.
 *
 * @param {HTMLElement} designer Designer HTML element.
 * @param {string} type New layer type.
 * @param {number} index Layer index.
 * @param {Object} data New layer data.
 */


function createLayer(designer, type, index) {
  var data = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var layer = null;

  switch (type) {
    case 'image':
      layer = createLayerImage(index, data);
      break;

    case 'text':
      layer = createLayerText(index, data);
      break;

    case 'filter':
      layer = createLayerFilter(index, data);
      break;

    case 'line':
      layer = createLayerLine(index, data);
      break;

    case 'ellipse':
      layer = createLayerEllipse(index, data);
      break;

    case 'rectangle':
      layer = createLayerRectangle(index, data);
      break;
  }

  if (null === layer) {
    return;
  }

  designer.insertBefore(layer, designer.firstChild);
  reorderLayers(designer); // Delete this layer button.

  createDeleteLayerButton(designer, layer); // Reorder layers button.

  createOrderLayersButton(designer, layer);
}
/**
 * Create layers designer control.
 *
 * @param {HTMLElement} fieldset Fieldset HTML element.
 * @param {Object} data Current template data.
 */


function createDesigner(fieldset, data) {
  var control = builders.control({
    classes: ['sharing-image-editor-control', 'control-row', 'control-compact', 'control-pinned'],
    fields: [{
      group: 'select',
      classes: ['sharing-image-editor-select'],
      options: {
        text: editor_('Text', 'sharing-image'),
        image: editor_('Image', 'sharing-image'),
        filter: editor_('Filter', 'sharing-image'),
        rectangle: editor_('Rectangle', 'sharing-image'),
        line: editor_('Line', 'sharing-image'),
        ellipse: editor_('Ellipse', 'sharing-image')
      }
    }],
    append: fieldset
  });
  var button = builders.element('button', {
    classes: ['button'],
    text: editor_('Add new', 'sharing-image'),
    attributes: {
      type: 'button'
    },
    append: control
  });
  var designer = builders.element('div', {
    classes: ['snaring-image-editor-designer'],
    append: fieldset
  }); // Set default layers set.

  var layers = data.layers || [];
  layers = layers.reverse();
  layers.forEach(function (layer, index) {
    if (layer.hasOwnProperty('type')) {
      createLayer(designer, layer.type, index++, layer);
    }
  });
  button.addEventListener('click', function () {
    var select = control.querySelector('select');

    if (null === select) {
      return;
    }

    createLayer(designer, select.value, designer.children.length);
  });
}
/**
 * Create common template settings on template editor screen.
 *
 * @param {HTMLElement} form Form HTML element.
 * @param {Object} data Current template data.
 */


function createFieldset(form, data) {
  var fieldset = builders.element('div', {
    classes: ['sharing-image-editor-fieldset'],
    append: form
  }); // Create template title control.

  builders.control({
    classes: ['sharing-image-editor-control', 'control-compact'],
    help: editor_('Used only in the admin panel', 'sharing-image'),
    fields: [{
      group: 'input',
      classes: ['sharing-image-editor-input'],
      attributes: {
        name: params.name + '[title]',
        value: data.title || ''
      },
      label: editor_('Template title', 'sharing-image')
    }],
    append: fieldset
  }); // Create background settings with custom logic.

  createPermanentAttachment(fieldset, data); // Create width/height settings control.

  builders.control({
    classes: ['sharing-image-editor-control', 'control-grid', 'control-compact'],
    fields: [{
      group: 'input',
      classes: ['sharing-image-editor-input'],
      attributes: {
        name: params.name + '[width]',
        value: data.width || '1200',
        placeholder: '1200'
      },
      label: editor_('Editor width', 'sharing-image')
    }, {
      group: 'input',
      classes: ['sharing-image-editor-input'],
      attributes: {
        name: params.name + '[height]',
        value: data.height || '630',
        placeholder: '630'
      },
      label: editor_('Editor height', 'sharing-image')
    }],
    append: fieldset
  });
  var description = [];
  description.push(editor_('You can add multiple layers on your editor.', 'sharing-image'));
  description.push(editor_('Note that the stacking order of the layers is important.', 'sharing-image'));
  description.push(editor_('You can change the order using the arrows in the corner of each box.', 'sharing-image'));
  builders.control({
    classes: ['sharing-image-editor-control', 'control-pinned'],
    label: editor_('Add layers', 'sharing-image'),
    description: description.join(' '),
    append: fieldset
  }); // Create layers designer block.

  createDesigner(fieldset, data);
  var footer = builders.control({
    classes: ['sharing-image-editor-control', 'control-overlined'],
    append: fieldset
  }); // Create back to catalog button.

  createCatalogButton(footer); // Create template deletion button.

  createDeleteButton(form, footer);
  fieldset.addEventListener('change', function (e) {
    if (form.classList.contains('editor-suspend')) {
      return;
    }

    var target = e.target;

    if (target.hasAttribute('name')) {
      generateTemplate(form);
    }
  });
}
/**
 * Create button to submit editor form.
 *
 * @param {HTMLElement} form Form HTML element.
 * @param {HTMLElement} manager Manager element.
 */


function createSubmitButton(form, manager) {
  builders.element('button', {
    text: editor_('Save changes', 'sharing-image'),
    classes: ['button', 'button-primary'],
    attributes: {
      type: 'submit'
    },
    append: manager
  });
}
/**
 * Create button to generate new template manually.
 *
 * @param {HTMLElement} form Form HTML element.
 * @param {HTMLElement} manager Manager element.
 */


function createGenerateButton(form, manager) {
  var button = builders.element('button', {
    text: editor_('Generate preview', 'sharing-image'),
    classes: ['button'],
    attributes: {
      type: 'button'
    },
    append: manager
  });
  button.addEventListener('click', function () {
    generateTemplate(form);
  });
}
/**
 * Create disable live-reloading checkbox.
 *
 * @param {HTMLElement} form Form HTML element.
 * @param {HTMLElement} manager Manager element.
 * @param {Object} data Template data.
 */


function createSuspendCheckbox(form, manager, data) {
  var checkbox = builders.checkbox({
    classes: ['sharing-image-editor-suspend'],
    attributes: {
      name: params.name + '[suspend]',
      value: 'suspend'
    },
    label: editor_('Disable live-reload', 'sharing-image'),
    checked: data.suspend
  }, manager);

  if (data.suspend) {
    form.classList.add('editor-suspend');
  }

  checkbox.addEventListener('change', function () {
    form.classList.remove('editor-suspend');

    if (checkbox.checked) {
      form.classList.add('editor-suspend');
    }
  });
}
/**
 * Create template settings preview.
 *
 * @param {HTMLElement} form Form HTML element.
 * @param {Object} data Current template data.
 */


function createMonitor(form, data) {
  var monitor = builders.element('div', {
    classes: ['sharing-image-editor-monitor'],
    append: form
  });
  var viewport = builders.element('div', {
    classes: ['sharing-image-editor-viewport'],
    append: monitor
  });
  createPreview(viewport, data);
  builders.element('div', {
    classes: ['sharing-image-editor-warning'],
    append: viewport
  });
  var manager = builders.element('div', {
    classes: ['sharing-image-editor-manager'],
    append: viewport
  }); // Create live-reload manager checkbox.

  createSuspendCheckbox(form, manager, data); // Create submit form button.

  createSubmitButton(form, manager); // Create template generator button.

  createGenerateButton(form, manager);
}
/**
 * Create form hidden settings fields.
 *
 * @param {HTMLElement} form Settings form element.
 * @param {number} index Current option index.
 */


function prepareEditor(form, index) {
  form.classList.add('sharing-image-editor');
  builders.element('input', {
    attributes: {
      type: 'hidden',
      name: 'sharing-image-index',
      value: index
    },
    append: form
  });
  builders.element('input', {
    attributes: {
      type: 'hidden',
      name: 'action',
      value: params.name
    },
    append: form
  });
  builders.element('input', {
    attributes: {
      type: 'hidden',
      name: 'nonce',
      value: params.nonce
    },
    append: form
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    saveTemplate(form);
  });
}
/**
 * Create template editor page.
 *
 * @param {HTMLElement} form Settings form element.
 * @param {Object} settings Global settings field.
 * @param {number} index Current option index.
 * @param {Object} data Template data.
 */


function createEditor(form, settings, index) {
  var data = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  params = settings; // Set params name for template form fields.

  params.name = 'sharing-image-editor'; // Create monitor section part.

  createMonitor(form, data); // Create fieldset section part.

  createFieldset(form, data); // Prepare form with hidden fields and events.

  prepareEditor(form, index);
}

/* harmony default export */ var editor = (createEditor);
// CONCATENATED MODULE: ./src/scripts/sections/index.js


var Section = {
  catalog: catalog,
  editor: editor
};
/* harmony default export */ var sections = (Section);
// CONCATENATED MODULE: ./src/scripts/settings.js



/**
 * Init premium settings tab.
 */

function initPremiumTab() {}
/**
 * Init config settings tab.
 */


function initConfigTab() {}
/**
 * Init config settings tab.
 *
 * @param {HTMLElement} form Settings form element.
 */


function initTemplatesTab(form) {
  var settings = window.sharingImageSettings || {}; // Get index from URL search parameter.

  var index = null; // Get templates from settings.

  settings.templates = settings.templates || [];

  if (helpers.param('template')) {
    index = parseInt(helpers.param('template')) - 1;
  }

  var data = settings.templates[index]; // Create editor for existing template.

  if (undefined !== data) {
    return sections.editor(form, settings, index, data);
  } // Create editor for new template.


  if (settings.templates.length === index) {
    return sections.editor(form, settings, index);
  }

  return sections.catalog(form, settings);
}
/**
 * Route settings by url parameter.
 */


var settings_routeSettings = function routeSettings() {
  if (typeof_default()('undefined') === wp) {
    return;
  } // Find settings form element.


  var form = document.querySelector('#sharing-image-settings > form');

  if (null === form) {
    return;
  }

  var tab = helpers.param('tab');

  switch (tab) {
    case 'config':
      return initConfigTab();

    case 'premium':
      return initPremiumTab();

    default:
      return initTemplatesTab(form);
  }
};

settings_routeSettings();

/***/ })
/******/ ]);