/* eslint-disable no-console */
'use strict';
const utils = require('./utils');
const path = require('path');

console.log('publishing packages');

utils.forEachPackage((packages, dirname) => {
  if (dirname !== 'stylishly-utils') {
    return `npm publish ${path.join(packages, dirname)}`;
  }
  return '';
}).then(() => {
  console.log('done');
});
