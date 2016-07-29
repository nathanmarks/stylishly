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

  describe('should render CSS to multiple styleSheets', () => {
    let rules;

    before(() => {
      const simple = createSimple();
      rules = simple.rules;
    });

    it('should render two CSS rules to both sheets', (done) => {
      const domDocument = jsdom('');
      const renderer = createDOMRenderer({ domDocument });
      let count = 0;
      renderer.events.on('renderSheet', () => {
        count++;
        if (count === 2) {
          process.nextTick(() => {
            assert.strictEqual(domDocument.head.children.length, 2);
            assert.strictEqual(domDocument.head.children[0].getAttribute('data-stylishly'), 'default');
            assert.strictEqual(
              domDocument.head.children[0].textContent,
              '.foo__button{color:red}.foo__button.foo__primary{color:purple}',
              'the default group should have the rules'
            );

            assert.strictEqual(domDocument.head.children[1].getAttribute('data-stylishly'), 'woof');
            assert.strictEqual(
              domDocument.head.children[1].textContent,
              '.foo__button{color:red}.foo__button.foo__primary{color:purple}',
              'the woof group should also have the rules'
            );
            done();
          });
        }
      });

      renderer.renderSheet('foo1', rules);
      renderer.renderSheet('foo2', rules, { group: 'woof' });
    });

    it('should remove all rules', (done) => {
      const domDocument = jsdom('');
      const renderer = createDOMRenderer({ domDocument });
      let count = 0;
      renderer.events.on('renderSheet', () => {
        count++;
        if (count === 2) {
          process.nextTick(() => {
            assert.strictEqual(domDocument.head.children.length, 2);
            assert.strictEqual(domDocument.head.children[0].getAttribute('data-stylishly'), 'default');
            assert.strictEqual(
              domDocument.head.children[0].textContent,
              '.foo__button{color:red}.foo__button.foo__primary{color:purple}',
              'the default group should have the rules'
            );

            assert.strictEqual(domDocument.head.children[1].getAttribute('data-stylishly'), 'woof');
            assert.strictEqual(
              domDocument.head.children[1].textContent,
              '.foo__button{color:red}.foo__button.foo__primary{color:purple}',
              'the woof group should also have the rules'
            );

            renderer.removeAll();
          });
        }
      });

      renderer.events.on('removeAll', () => {
        process.nextTick(() => {
          assert.strictEqual(domDocument.head.children.length, 2);
          assert.strictEqual(domDocument.head.children[0].getAttribute('data-stylishly'), 'default');
          assert.strictEqual(
            domDocument.head.children[0].textContent,
            '',
            'the default group should have no rules'
          );

          assert.strictEqual(domDocument.head.children[1].getAttribute('data-stylishly'), 'woof');
          assert.strictEqual(
            domDocument.head.children[1].textContent,
            '',
            'the woof group should also have no rules'
          );
          done();
        });
      });

      renderer.renderSheet('foo1', rules);
      renderer.renderSheet('foo2', rules, { group: 'woof' });
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

    it('should render css to a stylesheet', (done) => {
      const domDocument = jsdom('');
      const renderer = createDOMRenderer({ domDocument });

      renderer.events.once('renderSheet', () => {
        process.nextTick(() => {
          const domNodeContent = domDocument.head.children[0].textContent;
          assert.strictEqual(
            domNodeContent,
            '.foo__base--a{display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex;align-items:center;justify-content:flex-end;-webkit-align-items:center;-ms-flex-align:center;-webkit-box-align:center;-webkit-justify-content:flex-end;-ms-flex-pack:end;-webkit-box-pack:end}.foo__base--a .foo__button--a{color:red;min-width:64px}.foo__base--a .foo__button--a:hover{color:blue}.foo__base--a .foo__button--a.foo__primary--a{color:purple}.foo__titanic--a{float:none}@media (min-width: 800px){.foo__titanic--a{float:left}.foo__base--a .foo__button--a{min-width:none}}.foo__container--a{width:20px}@media (min-width: 500px){.foo__container--a{width:100px}}@media (max-width: 1024px){.foo__hoisted--a{color:green}}' // eslint-disable-line max-len
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
            '.foo__base--a{display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex;align-items:center;justify-content:flex-end;-webkit-align-items:center;-ms-flex-align:center;-webkit-box-align:center;-webkit-justify-content:flex-end;-ms-flex-pack:end;-webkit-box-pack:end}.foo__base--a .foo__button--a{color:red;min-width:64px}.foo__base--a .foo__button--a:hover{color:blue}.foo__base--a .foo__button--a.foo__primary--a{color:purple}.foo__titanic--a{float:none}@media (min-width: 800px){.foo__titanic--a{float:left}.foo__base--a .foo__button--a{min-width:none}}.foo__container--a{width:20px}@media (min-width: 500px){.foo__container--a{width:100px}}@media (max-width: 1024px){.foo__hoisted--a{color:green}}' // eslint-disable-line max-len
          );
          done();
        });
      });

      renderer.renderSheet(styleSheet.name, rules);
    });

    it('should render css to an existing node automatically with the correct attribute set', (done) => {
      const domDocument = jsdom('');
      const element = domDocument.createElement('style');
      element.setAttribute('data-stylishly', 'default');
      domDocument.head.appendChild(element);

      const renderer = createDOMRenderer({ domDocument });

      renderer.events.once('renderSheet', () => {
        process.nextTick(() => {
          const domNodeContent = domDocument.head.children[0].textContent;
          assert.strictEqual(
            domNodeContent,
            '.foo__base--a{display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex;align-items:center;justify-content:flex-end;-webkit-align-items:center;-ms-flex-align:center;-webkit-box-align:center;-webkit-justify-content:flex-end;-ms-flex-pack:end;-webkit-box-pack:end}.foo__base--a .foo__button--a{color:red;min-width:64px}.foo__base--a .foo__button--a:hover{color:blue}.foo__base--a .foo__button--a.foo__primary--a{color:purple}.foo__titanic--a{float:none}@media (min-width: 800px){.foo__titanic--a{float:left}.foo__base--a .foo__button--a{min-width:none}}.foo__container--a{width:20px}@media (min-width: 500px){.foo__container--a{width:100px}}@media (max-width: 1024px){.foo__hoisted--a{color:green}}' // eslint-disable-line max-len
          );
          done();
        });
      });

      renderer.renderSheet(styleSheet.name, rules);
    });
  });
});
