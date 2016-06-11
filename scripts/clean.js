/* eslint-disable no-console */
'use strict';
const utils = require('./utils');
const path = require('path');

console.log('cleaning packages');

utils.forEachPackage((packages, dirname) => {
  return `node_modules/.bin/rimraf ${path.join(packages, dirname, 'lib')}`;
}).then(() => {
  console.log('done');
});
