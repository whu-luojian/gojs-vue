'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/gojs-vue.min.js');
} else {
  module.exports = require('./cjs/gojs-vue.js');
}
