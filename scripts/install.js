/* eslint-disable no-console */
'use strict';
const utils = require('./utils');
const path = require('path');

console.log('installing package dependencies');

utils.forEachPackage((packages, dirname) => {
  return `npm install ${path.join(packages, dirname)}`;
}).then(() => {
  console.log('done');
});
