/* eslint-env mocha */
import { assert } from 'chai';
import componentSelectors from './componentSelectors';

describe('plugins/componentSelectors.js', () => {
  const componentSelectorsPlugin = componentSelectors();

  it('should set selectorText to a formatted selector', () => {
    const rule = {
      name: 'myButton',
      type: 'style',
      selectorText: 'my-button'
    };

    componentSelectorsPlugin.addRuleHook(rule, {
      styleSheet: { prefix: 'foo' },
      theme: { id: 'abc' }
    });

    assert.strictEqual(rule.selectorText, '.foo__my-button--abc');
  });
});
