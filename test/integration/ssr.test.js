/* eslint-env mocha */
import fs from 'fs';
import path from 'path';
import { assert } from 'chai';
import { createDOMRenderer } from 'packages/stylishly/src/renderers/domRenderer';
import { createVirtualRenderer } from 'packages/stylishly/src/renderers/virtualRenderer';
import { jsdom } from 'jsdom';
import { createKitchenSinkSheet } from 'test/fixtures/styleSheets/kitchenSink';

const kitchenSinkCss = fs
  .readFileSync(path.resolve(__dirname, '../fixtures/styleSheets/kitchenSink.css'), 'utf8')
  .trim();

describe('server-side rendering', () => {
  describe('virtual renderer vs dom renderer output', () => {
    let rules;
    let styleSheet;

    before(() => {
      const sink = createKitchenSinkSheet();
      rules = sink.rules;
      styleSheet = sink.styleSheet;
    });

    it('should render the same CSS string', (done) => {
      const domDocument = jsdom('');
      const renderer = createDOMRenderer({ domDocument });

      renderer.events.once('renderSheet', () => {
        process.nextTick(() => {
          const domNodeContent = domDocument.head.children[0].textContent;
          assert.strictEqual(
            domNodeContent,
            renderer.renderSheetsToCSS().default
          );
          done();
        });
      });

      renderer.renderSheet(styleSheet.name, rules);
    });
  });

  describe('replacing render output in the style node', () => {
    let rules;
    let styleSheet;
    let domDocument;
    let styleNode;

    before(() => {
      const sink = createKitchenSinkSheet();
      rules = sink.rules;
      styleSheet = sink.styleSheet;
      domDocument = jsdom('');
      styleNode = domDocument.createElement('style');
      styleNode.setAttribute('data-stylishly', 'default');
      domDocument.head.appendChild(styleNode);

      const renderer = createVirtualRenderer({ domDocument });
      renderer.renderSheet(styleSheet.name, rules);

      styleNode.textContent = renderer.renderSheetsToCSS().default;
    });

    it('should have the "server rendered" CSS string in the node', () => {
      const domNodeContent = domDocument.head.children[0].textContent;
      assert.strictEqual(domNodeContent, kitchenSinkCss);
    });

    it('should render the CSS correctly on the client', (done) => {
      const renderer = createDOMRenderer({ domDocument });

      renderer.events.once('renderSheet', () => {
        process.nextTick(() => {
          const domNodeContent = domDocument.head.children[0].textContent;
          assert.strictEqual(
            domNodeContent,
            renderer.renderSheetsToCSS().default,
            'should have matching css strings'
          );
          done();
        });
      });

      renderer.renderSheet(styleSheet.name, rules);
    });
  });
});
