/* eslint-env mocha */
import { assert } from 'chai';
import canUseDOM from './canUseDOM';

describe('utils/canUseDOM.js', () => {
  it('should be false in node', () => {
    assert.strictEqual(canUseDOM, false);
  });
});
