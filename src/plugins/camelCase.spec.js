/* eslint-env mocha */
import { assert } from 'chai';
import camelCase from './camelCase';

describe('plugins/camelCase.js', () => {
  const camelCasePlugin = camelCase();

  it('should transform camelCase style properties', () => {
    const rule = {
      type: 'style',
      declaration: {
        backgroundColor: 'red',
        minWidth: '50%'
      }
    };

    camelCasePlugin.addRuleHook(rule);

    assert.strictEqual(rule.declaration.backgroundColor, undefined);
    assert.strictEqual(rule.declaration.minWidth, undefined);
    assert.strictEqual(rule.declaration['background-color'], 'red');
    assert.strictEqual(rule.declaration['min-width'], '50%');
  });
});
