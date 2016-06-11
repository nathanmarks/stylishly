/* eslint-env mocha */
import { assert } from 'chai';
import {
  kebabCase
} from './helpers';

describe('utils/helpers.js', () => {
  describe('kebabCase()', () => {
    it('should kebabCase strings', () => {
      assert.strictEqual(kebabCase('Foo'), 'foo');
      assert.strictEqual(kebabCase('MyButton'), 'my-button');
    });
  });
});
