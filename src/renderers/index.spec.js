/* eslint-env mocha */
import { assert } from 'chai';
import { getRenderer } from './index';

describe('renderers/index.js', () => {
  it('should get the appropriate renderer', () => {
    const renderer = getRenderer();
    assert.strictEqual(typeof renderer, 'object');
    assert.strictEqual(typeof renderer.getSheet, 'function');
    assert.strictEqual(typeof renderer.getSheets, 'function');
    assert.strictEqual(typeof renderer.renderSheet, 'function');
    assert.strictEqual(typeof renderer.removeSheet, 'function');
  });
});
