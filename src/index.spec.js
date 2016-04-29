/* eslint-env mocha */
import { assert } from 'chai';
import sayHello from './index';

describe('index.js', () => {
  it('exports a function that returns a greeting', () => {
    assert.strictEqual(
      sayHello(),
      'Hello',
      'should return "Hello"'
    );
    assert.strictEqual(
      sayHello('Nathan'),
      'Hello Nathan',
      'should return "Hello Nathan"'
    );
  });
});
