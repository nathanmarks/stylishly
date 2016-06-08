/* eslint-env mocha */
import { assert } from 'chai';
import { getRenderer } from './index';
import { jsdom } from 'jsdom';

describe('renderers/index.js', () => {
  it('should get the appropriate renderer', () => {
    const renderer = getRenderer(false);
    assert.strictEqual(typeof renderer, 'object');
    assert.strictEqual(typeof renderer.getSheet, 'function');
    assert.strictEqual(typeof renderer.getSheets, 'function');
    assert.strictEqual(typeof renderer.renderSheet, 'function');
    assert.strictEqual(typeof renderer.removeSheet, 'function');

    const domDocument = jsdom('');
    const DOMrenderer = getRenderer(true, { domDocument });
    assert.strictEqual(typeof DOMrenderer, 'object');
    assert.strictEqual(typeof DOMrenderer.getSheet, 'function');
    assert.strictEqual(typeof DOMrenderer.getSheets, 'function');
    assert.strictEqual(typeof DOMrenderer.renderSheet, 'function');
    assert.strictEqual(typeof DOMrenderer.removeSheet, 'function');
  });
});
