/* eslint-disable no-console */
'use strict';
const utils = require('./utils');
const path = require('path');

console.log('publishing packages');

utils.forEachPackage((packages, dirname) => {
  return `npm publish ${path.join(packages, dirname)}`;
}).then(() => {
  console.log('done');
});
