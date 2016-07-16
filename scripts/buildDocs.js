'use strict';
const jsdoc2md = require('jsdoc-to-markdown');
const fs = require('fs');
const dmd = require('dmd');
const util = require('util');
const path = require('path');
const collectJson = require('collect-json');

/* paths used by this script */
const rootPath = path.resolve(__dirname, '../');
const p = {
  conf: path.resolve(rootPath, 'docs.conf.json'),
  partial: path.resolve(rootPath, 'docs/_partials/**/*.hbs'),
  separators: true,
  src: [
    path.resolve(rootPath, 'packages/stylishly/src/styleManager.js'),
    path.resolve(rootPath, 'packages/stylishly/src/styleSheet.js'),
    path.resolve(rootPath, 'packages/stylishly/src/pluginRegistry.js'),
  ],
  output: path.resolve(rootPath, 'docs/api/%s.md'),
};

jsdoc2md({
  src: p.src,
  partial: p.partial,
  separators: p.separators,
  json: true,
})
  .pipe(collectJson((data) => {
    /* reduce the jsdoc-parse output to an array of module names */
    const modules = data.reduce((prev, curr) => {
      if (curr.kind === 'module') prev.push(curr.name);
      return prev;
    }, []);

    /* render an output file for each module */
    writeMarkdownFile(data, modules, 0);
  }));

function writeMarkdownFile(data, modules, index) {
  const moduleName = modules[index];
  const template = util.format('{{#module name="%s"}}{{>docs}}{{/module}}', moduleName);
  console.log(util.format( // eslint-disable-line no-console
    'rendering %s, template: %s', moduleName, template
  ));

  const modulePath = p.src[index].match(/.*packages\/stylishly\/src\/(.*)\.js$/)[1];

  const dmdStream = dmd({
    src: p.src,
    partial: p.partial,
    separators: p.separators,
    template: template,
  });
  dmdStream
    .pipe(fs.createWriteStream(util.format(p.output, modulePath)))
    .on('close', () => {
      const next = index + 1;
      if (modules[next]) {
        writeMarkdownFile(data, modules, next);
      }
    });
  dmdStream.end(JSON.stringify(data));
}
