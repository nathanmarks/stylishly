/* eslint-env mocha */
import { assert } from 'chai';
import { createDOMRenderer } from './domRenderer';
import { jsdom } from 'jsdom';
import { createSimple, createKitchenSinkSheet } from 'test/fixtures/styleSheets/kitchenSink';

describe('renderers/domRenderer.js', () => {
  describe('simple', () => {
    let rules;
    let styleSheet;

    before(() => {
      const simple = createSimple();
      rules = simple.rules;
      styleSheet = simple.styleSheet;
    });

    it('should render two CSS rules', (done) => {
      const domDocument = jsdom('');
      const renderer = createDOMRenderer({ domDocument });

      renderer.events.once('renderSheet', () => {
        process.nextTick(() => {
          const domNodeContent = domDocument.head.children[0].textContent;
          assert.strictEqual(
            domNodeContent,
            '.foo__button{color:red}.foo__button.foo__primary{color:purple}'
          );
          done();
        });
      });

      renderer.renderSheet(styleSheet.name, rules);
    });
  });

  describe('kitchenSink', () => {
    let rules;
    let styleSheet;

    before(() => {
      const sink = createKitchenSinkSheet();
      rules = sink.rules;
      styleSheet = sink.styleSheet;
    });

    it('should render css to a spreadsheet', (done) => {
      const domDocument = jsdom('');
      const renderer = createDOMRenderer({ domDocument });

      renderer.events.once('renderSheet', () => {
        process.nextTick(() => {
          const domNodeContent = domDocument.head.children[0].textContent;
          assert.strictEqual(
            domNodeContent,
            '.foo__base{display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex;align-items:center;justify-content:flex-end;-webkit-align-items:center;-ms-flex-align:center;-webkit-box-align:center;-webkit-justify-content:flex-end;-ms-flex-pack:end;-webkit-box-pack:end}.foo__base .foo__button{color:red;min-width:64px}.foo__base .foo__button:hover{color:blue}.foo__base .foo__button.foo__primary{color:purple}.foo__titanic{float:none}@media (min-width: 800px){.foo__titanic{float:left}.foo__base .foo__button{min-width:none}}.foo__container{width:20px}@media (min-width: 500px){.foo__container{width:100px}}@media (max-width: 1024px){.foo__hoisted{color:green}}' // eslint-disable-line max-len
          );
          done();
        });
      });

      renderer.renderSheet(styleSheet.name, rules);
    });

    it('should render css to an existing node', (done) => {
      const domDocument = jsdom('');
      const element = domDocument.createElement('style');
      domDocument.head.appendChild(element);

      const renderer = createDOMRenderer({ domDocument, element });

      renderer.events.once('renderSheet', () => {
        process.nextTick(() => {
          const domNodeContent = domDocument.head.children[0].textContent;
          assert.strictEqual(
            domNodeContent,
            '.foo__base{display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex;align-items:center;justify-content:flex-end;-webkit-align-items:center;-ms-flex-align:center;-webkit-box-align:center;-webkit-justify-content:flex-end;-ms-flex-pack:end;-webkit-box-pack:end}.foo__base .foo__button{color:red;min-width:64px}.foo__base .foo__button:hover{color:blue}.foo__base .foo__button.foo__primary{color:purple}.foo__titanic{float:none}@media (min-width: 800px){.foo__titanic{float:left}.foo__base .foo__button{min-width:none}}.foo__container{width:20px}@media (min-width: 500px){.foo__container{width:100px}}@media (max-width: 1024px){.foo__hoisted{color:green}}' // eslint-disable-line max-len
          );
          done();
        });
      });

      renderer.renderSheet(styleSheet.name, rules);
    });

    it('should render css to an existing node automatically with the correct attribute set', (done) => {
      const domDocument = jsdom('');
      const element = domDocument.createElement('style');
      element.setAttribute('data-stylishly', true);
      domDocument.head.appendChild(element);

      const renderer = createDOMRenderer({ domDocument });

      renderer.events.once('renderSheet', () => {
        process.nextTick(() => {
          const domNodeContent = domDocument.head.children[0].textContent;
          assert.strictEqual(
            domNodeContent,
            '.foo__base{display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex;align-items:center;justify-content:flex-end;-webkit-align-items:center;-ms-flex-align:center;-webkit-box-align:center;-webkit-justify-content:flex-end;-ms-flex-pack:end;-webkit-box-pack:end}.foo__base .foo__button{color:red;min-width:64px}.foo__base .foo__button:hover{color:blue}.foo__base .foo__button.foo__primary{color:purple}.foo__titanic{float:none}@media (min-width: 800px){.foo__titanic{float:left}.foo__base .foo__button{min-width:none}}.foo__container{width:20px}@media (min-width: 500px){.foo__container{width:100px}}@media (max-width: 1024px){.foo__hoisted{color:green}}' // eslint-disable-line max-len
          );
          done();
        });
      });

      renderer.renderSheet(styleSheet.name, rules);
    });
  });
});
