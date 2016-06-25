/* eslint-disable no-console */
'use strict';
const fs = require('fs');
const path = require('path');
const semver = require('semver');
const utils = require('./utils');

const newVersion = process.argv.pop();

console.log('updating packages');

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
    console.log(pkg);
    fs.readFile(pkg, 'utf8', (err, data) => {
      if (err) {
        throw err;
      }
      resolve(data);
    });
  })
  .then((data) => JSON.parse(data))
  .then((packageData) => {
    const diff = semver.diff(newVersion, packageData.version);
    console.log(diff);
    if (semver.gt(newVersion, packageData.version)) {
      if (diff !== 'patch') {
        packageData.version = newVersion;

        if (
          packageData.peerDependencies &&
          packageData.peerDependencies.stylishly
        ) {
          packageData.peerDependencies.stylishly = `^${newVersion}`;
        }
      }
    }

    if (
      packageData.dependencies &&
      packageData.dependencies['stylishly-utils'] &&
      semver.gt(newVersion, packageData.dependencies['stylishly-utils'].replace(/^\^/, ''))
    ) {
      packageData.dependencies['stylishly-utils'] = `^${newVersion}`;
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
