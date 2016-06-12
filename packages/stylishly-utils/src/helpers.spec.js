/* eslint-env mocha */
import { assert } from 'chai';
import {
  kebabCase,
  transform
} from './helpers';

describe('stylishly-utils/helpers.js', () => {
  describe('kebabCase(string)', () => {
    it('should kebabCase strings', () => {
      assert.strictEqual(kebabCase('Foo'), 'foo');
      assert.strictEqual(kebabCase('MyButton'), 'my-button');
    });
  });

  describe('transform(obj, cb, accumulator)', () => {
    it('should transform an object into an array', () => {
      const obj = {
        woof: 'meow',
        roar: 'foo'
      };

      const result = transform(obj, (res, value, key) => {
        res.push(key);
        res.push(value);
      }, []);

      assert.strictEqual(result[0], 'woof');
      assert.strictEqual(result[1], 'meow');
      assert.strictEqual(result[2], 'roar');
      assert.strictEqual(result[3], 'foo');
    });
  });
});
