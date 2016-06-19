/* eslint-env mocha */
import { assert } from 'chai';
import descendants from './descendants';

describe('plugins/descendants.js', () => {
  let descendantsPlugin;

  before(() => {
    descendantsPlugin = descendants();
  });

  it('should format the descendant selector', () => {
    const rules = [{
      name: 'button',
      type: 'style',
      selectorText: '.button',
      declaration: {
        color: 'blue'
      }
    }];

    rules.push({
      name: 'primary',
      type: 'style',
      nested: true,
      declaration: {
        color: 'red'
      },
      parent: rules[0]
    });

    const selectorText = descendantsPlugin.resolveSelectorHook(
      '.primary',
      'primary',
      rules[1],
      { rules, ruleDefinition: rules[1] }
    );

    assert.strictEqual(selectorText, '.button .primary');
  });
});
