/* eslint-disable no-console */
'use strict';
const cp = require('child_process');
const path = require('path');
const fs = require('fs');

const packages = path.resolve(__dirname, '../packages/');

const cmds = fs.readdirSync(packages).filter((dirname) => {
  return fs.statSync(path.join(packages, dirname)).isDirectory();
}).sort().map((dirname) => {
  const src = path.join(packages, dirname, 'src');
  const lib = path.join(packages, dirname, 'lib');
  return `node_modules/.bin/babel ${src} --ignore *.spec.js --out-dir ${lib}`;
});

let stack = function() {
  console.log('done');
};

for (let i = cmds.length - 1; i >= 0; i--) {
  const command = cmds[i];
  (stack = ((next, cmd) => {
    return () => {
      console.log(cmd);
      cp.exec(cmd, (error, stdout, stderr) => {
        if (error) {
          console.error(error);
        } else if (stderr) {
          console.error(stderr);
          next();
        } else {
          next();
        }
      });
    };
  })(stack, command));
}

stack();
