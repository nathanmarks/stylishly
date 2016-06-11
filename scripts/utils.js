/* eslint-disable no-console */
'use strict';
const cp = require('child_process');
const path = require('path');
const fs = require('fs');

module.exports = {
  forEachPackage(cb) {
    const packages = path.resolve(__dirname, '../packages/');

    return new Promise((resolve) => {
      const cmds = fs.readdirSync(packages).filter((dirname) => {
        return fs.statSync(path.join(packages, dirname)).isDirectory();
      }).sort().map((dirname) => {
        return cb(packages, dirname);
      });

      let stack = function() {
        resolve();
      };

      for (let i = cmds.length - 1; i >= 0; i--) {
        const command = cmds[i];
        (stack = ((next, cmd) => {
          return () => {
            if (typeof cmd === 'string') {
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
            } else if (typeof cmd === 'function') {
              cmd(next);
            }
          };
        })(stack, command));
      }

      stack();
    });
  }
};
