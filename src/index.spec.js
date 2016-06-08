/* eslint-env mocha */
import { assert } from 'chai';
import * as stylishly from './index';

describe('index.js', () => {
  it('should export 1 object and 2 functions', () => {
    assert.strictEqual(typeof stylishly.plugins, 'object');
    assert.strictEqual(typeof stylishly.createStyleManager, 'function');
    assert.strictEqual(typeof stylishly.createStyleSheet, 'function');
  });
});
