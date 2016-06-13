/* eslint-disable no-console */
'use strict';
const utils = require('./utils');
const path = require('path');

console.log('installing package dependencies');

utils.forEachPackage((packages, dirname) => {
  console.log(`cd ${path.join(packages, dirname)} && npm install`);
  return `cd ${path.join(packages, dirname)} && npm install`;
}).then(() => {
  console.log('done');
});
