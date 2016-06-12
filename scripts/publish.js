/* eslint-disable no-console */
'use strict';
const utils = require('./utils');
const path = require('path');

let onlyPublish;

if (process.argv.length > 2) {
  onlyPublish = process.argv.pop();
}

console.log('publishing packages');

utils.forEachPackage((packages, dirname) => {
  if (
    dirname !== 'stylishly-utils' ||
    !onlyPublish ||
    onlyPublish === dirname
  ) {
    return `npm publish ${path.join(packages, dirname)}`;
  }
  return '';
}).then(() => {
  console.log('done');
});
