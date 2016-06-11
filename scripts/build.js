/* eslint-disable no-console */
'use strict';
const utils = require('./utils');
const path = require('path');

console.log('building packages');

utils.forEachPackage((packages, dirname) => {
  const src = path.join(packages, dirname, 'src');
  const lib = path.join(packages, dirname, 'lib');
  return `node_modules/.bin/babel ${src} --ignore *.spec.js --out-dir ${lib}`;
}).then(() => {
  console.log('done');
});
