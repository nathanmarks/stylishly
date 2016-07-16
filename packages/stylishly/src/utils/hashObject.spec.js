/* eslint-env mocha */
import { assert } from 'chai';
import hashObject from './hashObject';

describe('utils/hashObject.js', () => {
  it('should create a deterministic hash', () => {
    const hashes = Array(10);
    const woof = hashObject({ foo: 'bar', woof: 'meow' });
    const testA = hashes.map(() => hashObject({ foo: 'bar', woof: 'meow' }));
    testA.forEach((hash, i) => {
      if (i > 0) {
        assert.strictEqual(hash, woof);
      }
    });
  });
});
