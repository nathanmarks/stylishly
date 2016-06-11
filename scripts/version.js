/* eslint-disable no-console */
'use strict';
const fs = require('fs');
const path = require('path');
const semver = require('semver');
const utils = require('./utils');

const newVersion = process.argv.pop();

console.log('installing package dependencies');

utils.forEachPackage((packages, dirname) => {
  return (next) => {
    const pkg = path.join(packages, dirname, 'package.json');
    if (fs.statSync(pkg).isFile()) {
      updatePkg(pkg).then(() => next());
    } else {
      next();
    }
  };
}).then(() => {
  console.log('done');
}).catch((err) => {
  console.log(err);
});

function updatePkg(pkg) {
  return new Promise((resolve) => {
    fs.readFile(pkg, 'utf8', (err, data) => {
      if (err) {
        throw err;
      }
      resolve(data);
    });
  })
  .then((data) => JSON.parse(data))
  .then((packageData) => {
    if (semver.gt(newVersion, packageData.version)) {
      const diff = semver.diff(newVersion, packageData.version);
      if (diff !== 'patch') {
        packageData.version = newVersion;
      }
    }

    if (
      packageData.peerDependencies &&
      packageData.peerDependencies.stylishly
    ) {
      packageData.peerDependencies.stylishly = `^${newVersion}`;
    }

    return packageData;
  })
  .then((packageData) => {
    return new Promise((resolve) => {
      const data = JSON.stringify(packageData, null, 2);
      fs.writeFile(pkg, data, (err) => {
        if (err) {
          throw err;
        }
        console.log(`updated ${pkg}`);
        resolve();
      });
    });
  });
}
