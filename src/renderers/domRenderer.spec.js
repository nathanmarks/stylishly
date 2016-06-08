/* eslint-env mocha */
import { assert } from 'chai';
import { createDOMRenderer } from './domRenderer';
import { jsdom } from 'jsdom';
import { createKitchenSinkSheet } from 'test/fixtures/styleSheets/kitchenSink';

describe('renderers/domRenderer.js', () => {
  const { rules, styleSheet } = createKitchenSinkSheet();

  it('should render css to a spreadsheet', (done) => {
    const domDocument = jsdom('');
    const renderer = createDOMRenderer({ domDocument });

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

  it('should render css to an existing node', (done) => {
    const domDocument = jsdom('');
    const element = domDocument.createElement('style');
    domDocument.head.appendChild(element);

    const renderer = createDOMRenderer({ domDocument, element });

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

  it('should render css to an existing node automatically with the correct attribute set', (done) => {
    const domDocument = jsdom('');
    const element = domDocument.createElement('style');
    element.setAttribute('data-stylishly', true);
    domDocument.head.appendChild(element);

    const renderer = createDOMRenderer({ domDocument });

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
