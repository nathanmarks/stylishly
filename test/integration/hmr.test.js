/* eslint-env mocha */
import { assert } from 'chai';
import { createStyleSheet } from 'packages/stylishly/src/styleSheet';
import { createStyleManager } from 'packages/stylishly/src/styleManager';
import { createDOMRenderer } from 'packages/stylishly/src/renderers/domRenderer';
import { createVirtualRenderer } from 'packages/stylishly/src/renderers/virtualRenderer';
import { jsdom } from 'jsdom';

describe('HMR styleManager simulation', () => {
  let styleSheets;

  before(() => {
    styleSheets = {
      original: createStyleSheet('Foo', () => {
        return {
          base: {
            color: 'red',
          },
        };
      }),
      replacement: createStyleSheet('Foo', () => {
        return {
          base: {
            color: 'blue',
          },
        };
      }),
      original2: createStyleSheet('Foo2', () => {
        return {
          base: {
            color: 'red',
          },
        };
      }),
      replacement2: createStyleSheet('Foo2', () => {
        return {
          base: {
            color: 'blue',
          },
        };
      }),
    };
  });

  describe('virtual renderer integration', () => {
    const renderer = createVirtualRenderer();
    const styleManager = createStyleManager({ renderer });

    it('should render the original styleSheet', () => {
      styleManager.render(styleSheets.original);
      const { rules } = renderer.getSheet('Foo');
      assert.strictEqual(rules[0].declaration.color, 'red');
    });

    it('should render the replacement styleSheet and remove the original', () => {
      styleManager.render(styleSheets.replacement);
      const { rules } = renderer.getSheet('Foo');
      assert.strictEqual(rules[0].declaration.color, 'blue');
    });
  });

  describe('DOM renderer integration', () => {
    describe('simple', () => {
      let domDocument;
      let renderer;
      let styleManager;

      before(() => {
        domDocument = jsdom('');
        renderer = createDOMRenderer({ domDocument });
        styleManager = createStyleManager({ renderer });
      });

      it('should render the original rules', (done) => {
        renderer.events.once('renderSheet', () => {
          process.nextTick(() => {
            const domNodeContent = domDocument.head.children[0].textContent;
            assert.strictEqual(domNodeContent, '.foo__base{color:red}');
            done();
          });
        });
        styleManager.render(styleSheets.original);
      });

      it('should render the replacement rules and remove the original', (done) => {
        renderer.events.once('updateSheet', () => {
          process.nextTick(() => {
            const domNodeContent = domDocument.head.children[0].textContent;
            assert.strictEqual(domNodeContent, '.foo__base{color:blue}');
            done();
          });
        });
        styleManager.render(styleSheets.replacement);
      });
    });

    describe('multiple DOM sheets', () => {
      let domDocument;
      let renderer;
      let styleManager;

      before(() => {
        domDocument = jsdom('');
        renderer = createDOMRenderer({ domDocument });
        styleManager = createStyleManager({ renderer });
      });

      it('should render the original rules', (done) => {
        renderer.events.once('renderSheet', () => {
          process.nextTick(() => {
            const domNodeContent = domDocument.head.children[0].textContent;
            assert.strictEqual(domNodeContent, '.foo__base{color:red}');
            done();
          });
        });
        styleManager.render(styleSheets.original);
      });

      it('should render the original2 rules', (done) => {
        renderer.events.once('renderSheet', () => {
          process.nextTick(() => {
            const domNodeContent = domDocument.head.children[1].textContent;
            assert.strictEqual(domNodeContent, '.foo2__base{color:red}');
            done();
          });
        });
        styleManager.render(styleSheets.original2, { group: 'mygroup' });
      });

      it('should render the replacement rules and remove the original', (done) => {
        renderer.events.once('updateSheet', () => {
          process.nextTick(() => {
            const domNodeContent = domDocument.head.children[1].textContent;
            assert.strictEqual(domNodeContent, '.foo2__base{color:blue}');
            done();
          });
        });
        styleManager.render(styleSheets.replacement2, { group: 'mygroup' });
      });
    });
  });
});
