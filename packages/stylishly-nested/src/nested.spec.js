/* eslint-env mocha */
import { assert } from 'chai';
import { spy } from 'sinon';
import nested from './nested';

describe('plugins/nested.js', () => {
  let nestedPlugin;

  before(() => {
    nestedPlugin = nested();
  });

  it('should add the nested rule', () => {
    const rules = [{
      name: 'base',
      type: 'style',
      selectorText: '.base',
      declaration: {
        display: 'flex',
        button: {
          color: '#111'
        }
      }
    }];

    const addRule = spy();

    nestedPlugin.transformDeclarationHook(
      'button',
      { color: '#111' },
      rules[0],
      { addRule }
    );

    assert.strictEqual(
      rules[0].declaration.button,
      undefined,
      'should remove the nested key'
    );

    assert.strictEqual(addRule.callCount, 1, 'should call add rule');

    const nestedRuleDefinition = {
      name: 'button',
      declaration: { color: '#111' },
      nested: true,
      parent: rules[0]
    };

    assert.deepEqual(
      addRule.args[0][0],
      nestedRuleDefinition,
      'should call add rule with the nested args'
    );
  });
});
