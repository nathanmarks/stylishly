/* eslint-env mocha */
import { assert } from 'chai';
import { createDOMRenderer } from 'packages/stylishly/src/renderers/domRenderer';
import { createVirtualRenderer } from 'packages/stylishly/src/renderers/virtualRenderer';
import { jsdom } from 'jsdom';
import { createKitchenSinkSheet } from 'test/fixtures/styleSheets/kitchenSink';

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
      assert.strictEqual(
        domNodeContent,
        '.foo__base--a{display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex;align-items:center;justify-content:flex-end;-webkit-align-items:center;-ms-flex-align:center;-webkit-box-align:center;-webkit-justify-content:flex-end;-ms-flex-pack:end;-webkit-box-pack:end}.foo__base--a .foo__button--a{color:red;min-width:64px}.foo__base--a .foo__button--a:hover{color:blue}.foo__base--a .foo__button--a.foo__primary--a{color:purple}.foo__titanic--a{float:none}@media (min-width: 800px){.foo__titanic--a{float:left}.foo__base--a .foo__button--a{min-width:none}}.foo__container--a{width:20px}@media (min-width: 500px){.foo__container--a{width:100px}}@media (max-width: 1024px){.foo__hoisted--a{color:green}}' // eslint-disable-line max-len
      );
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
