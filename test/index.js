require('app-module-path').addPath(`${__dirname}'./../`);
import Minimist from 'minimist';
import Mocha from 'mocha';
import Glob from 'glob';

const argv = Minimist(process.argv.slice(2), {
  alias: {
    m: 'module',
    g: 'grep'
  }
});

const mocha = new Mocha({
  grep: argv.grep ? argv.grep : undefined
});

Glob(
  `{packages,test}/**/${argv.module ? argv.module : '*'}.{spec,test}.js`,
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
