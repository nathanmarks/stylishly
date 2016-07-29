/* eslint-env mocha */
import { assert } from 'chai';
import { createDOMRenderer } from 'packages/stylishly/src/domRenderer';
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

    it('should render css to a stylesheet', (done) => {
      const domDocument = jsdom('');
      const renderer = createDOMRenderer({ domDocument });

      renderer.events.once('renderSheet', () => {
        process.nextTick(() => {
          const domNodeContent = domDocument.head.children[0].textContent;
          assert.strictEqual(
            domNodeContent,

          );
          done();
        });
      });

      renderer.renderSheet(styleSheet.name, rules);
    });
  });
});
