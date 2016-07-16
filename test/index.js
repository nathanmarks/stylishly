require('app-module-path').addPath(`${__dirname}'./../`);
import Mock from 'mock-require';
import Minimist from 'minimist';
import Mocha from 'mocha';
import Glob from 'glob';

Mock('stylishly/lib/utils/helpers', '../packages/stylishly/src/utils/helpers');
Mock('stylishly/lib/utils/canUseDOM', '../packages/stylishly/src/utils/canUseDOM');

const argv = Minimist(process.argv.slice(2), {
  alias: {
    m: 'module',
    g: 'grep',
  },
});

const mocha = new Mocha({
  grep: argv.grep ? argv.grep : undefined,
});

const patterns = [
  `packages/*/src/**/${argv.module ? argv.module : '*'}.{spec,test}.js`,
  `test/**/${argv.module ? argv.module : '*'}.{spec,test}.js`,
];

Glob(
  `{${patterns.join(',')}}`,
  {
    ignore: '**/node_modules/**',
  },
  (err, files) => {
    files.forEach((file) => mocha.addFile(file));
    mocha.run((failures) => {
      process.on('exit', () => {
        process.exit(failures);
      });
    });
  }
);
