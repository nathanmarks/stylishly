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

  it('should set the selectorText correctly', () => {
    const rule = {
      name: '@raw body',
      type: 'style'
    };

    rawSelectorsPlugin.addRuleHook(rule, {
      styleSheet: { prefix: 'foo' },
      theme: { id: 'abc' }
    });

    assert.strictEqual(rule.selectorText, 'body');
  });
});
