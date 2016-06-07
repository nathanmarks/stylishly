/* eslint-env mocha */
import { assert } from 'chai';
import { createDOMRenderer } from './domRenderer';
import { jsdom } from 'jsdom';
import { createKitchenSinkSheet } from 'test/fixtures/styleSheets/kitchenSink';

describe('utils/domRenderer.js', () => {
  const domDocument = jsdom('');
  const renderer = createDOMRenderer({ domDocument });
  const { rules, styleSheet } = createKitchenSinkSheet();

  it('should render css to a spreadsheet', (done) => {
    renderer.events.once('renderSheet', () => {
      const domNodeContent = domDocument.head.children[0].textContent;
      assert.strictEqual(
        domNodeContent,
        '.kitchen-sink__base{display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex;align-items:center;justify-content:flex-end;-webkit-align-items:center;-ms-flex-align:center;-webkit-box-align:center;-webkit-justify-content:flex-end;-ms-flex-pack:end;-webkit-box-pack:end}.kitchen-sink__base .kitchen-sink__button{color:red;min-width:64px}.kitchen-sink__base .kitchen-sink__button:hover{color:blue}.kitchen-sink__titanic{float:none}@media (min-width: 800px){.kitchen-sink__titanic{float:left}.kitchen-sink__base .kitchen-sink__button{min-width:none}}' // eslint-disable-line max-len
      );
      done();
    });

    renderer.renderSheet(styleSheet.name, rules);
  });
});
