/* eslint-disable no-console */
'use strict';
const utils = require('./utils');
const path = require('path');

console.log('cleaning packages');

utils.forEachPackage((packages, dirname) => {
  const lib = path.join(packages, dirname, 'lib');
  const nodeModules = path.join(packages, dirname, 'node_modules');
  return `node_modules/.bin/rimraf ${lib} ${nodeModules}`;
}).then(() => {
  console.log('done');
});
