/* eslint-disable no-console */
'use strict';
const utils = require('./utils');
const path = require('path');

console.log('installing package dependencies');

utils.forEachPackage((packages, dirname) => {
  return `cd ${path.join(packages, dirname)} && npm install`;
}).then(() => {
  console.log('done');
});
