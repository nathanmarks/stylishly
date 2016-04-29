import Minimist from 'minimist';
import Mocha from 'mocha';
import Glob from 'glob';
import { jsdom } from 'jsdom';

/**
 * 1. Setup jsdom globals
 * 2. Parse args
 * 3. Glob files
 * 4. Run mocha
 */

const exposedProperties = ['window', 'navigator', 'document'];

global.document = jsdom('');
global.window = document.defaultView;

Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js',
};

const argv = Minimist(process.argv.slice(2), {
  alias: {
    c: 'component',
    g: 'grep',
  },
});

const mocha = new Mocha({
  grep: argv.grep ? argv.grep : undefined,
});

Glob(
  `src/**/${argv.component ? argv.component : 'Button'}.spec.js`,
  {},
  (err, files) => {
    files.forEach((file) => mocha.addFile(file));
    mocha.run((failures) => {
      process.on('exit', () => {
        process.exit(failures);
      });
    });
  }
);
