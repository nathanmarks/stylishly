/* eslint-env mocha */
import { assert } from 'chai';
import pseudoClasses from './pseudoClasses';

describe('plugins/pseudoClasses.js', () => {
  let pseudoClassesPlugin;

  before(() => {
    pseudoClassesPlugin = pseudoClasses();
  });

  it('should format the pseudoClasses selector', () => {
    const rules = [{
      name: 'button',
      type: 'style',
      selectorText: '.button',
      declaration: {
        color: 'blue',
      },
    }];

    rules.push({
      name: '&:hover',
      type: 'style',
      nested: true,
      declaration: {
        color: 'red',
      },
      parent: rules[0],
    });

    const selectorText = pseudoClassesPlugin.resolveSelectorHook(
      '.button',
      '&:hover',
      rules[1],
      { rules, ruleDefinition: rules[1] }
    );

    assert.strictEqual(selectorText, ':hover');
  });
});
