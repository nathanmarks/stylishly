/* eslint-env mocha */
import { assert } from 'chai';
import chained from './chained';

describe('plugins/chained.js', () => {
  let chainedPlugin;

  before(() => {
    chainedPlugin = chained();
  });

  it('should format the chained selector', () => {
    const rules = [{
      name: 'button',
      type: 'style',
      selectorText: '.button',
      declaration: {
        color: 'blue',
      },
    }];

    rules.push({
      name: '&primary',
      type: 'style',
      nested: true,
      declaration: {
        color: 'red',
      },
      parent: rules[0],
    });

    const selectorText = chainedPlugin.resolveSelectorHook(
      '.primary',
      '&primary',
      rules[1],
      { rules, ruleDefinition: rules[1] }
    );

    assert.strictEqual(selectorText, '.button.primary');
  });
});
