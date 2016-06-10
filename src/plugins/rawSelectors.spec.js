/* eslint-env mocha */
import { assert } from 'chai';
import rawSelectors from './rawSelectors';

/**
 * WARNING
 *
 * This is actually a pretty shitty test.
 * The integration test with the other selector feature is better.
 */
describe('plugins/rawSelectors.js', () => {
  const rawSelectorsPlugin = rawSelectors();

  it('should pass the selectorText through', () => {
    const rule = {
      name: 'myButton',
      type: 'style',
      selectorText: 'body'
    };

    rawSelectorsPlugin.addRuleHook(rule, {
      styleSheet: { prefix: 'foo' },
      theme: { id: 'abc' }
    });

    assert.strictEqual(rule.selectorText, 'body');
  });
});
