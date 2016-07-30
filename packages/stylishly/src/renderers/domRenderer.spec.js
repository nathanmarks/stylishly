/* eslint-env mocha */
import fs from 'fs';
import path from 'path';
import { assert } from 'chai';
import { createDOMRenderer } from './domRenderer';
import { jsdom } from 'jsdom';
import { createSimple, createKitchenSinkSheet } from 'test/fixtures/styleSheets/kitchenSink';

const kitchenSinkCss = fs
  .readFileSync(path.resolve(__dirname, '../../../../test/fixtures/styleSheets/kitchenSink.css'), 'utf8')
  .trim();

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
            kitchenSinkCss
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
            kitchenSinkCss
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
            kitchenSinkCss
          );
          done();
        });
      });

      renderer.renderSheet(styleSheet.name, rules);
    });
  });
});
