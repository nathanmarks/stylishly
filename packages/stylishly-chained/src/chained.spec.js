/* eslint-env mocha */
import { assert } from 'chai';
import { spy } from 'sinon';
import chained from './chained';

describe('plugins/chained.js', () => {
  const chainedPlugin = chained();

  it('should add the chained rule', () => {
    const rules = [{
      name: 'primary',
      type: 'style',
      selectorText: '.primary',
      declaration: {
        color: 'red',
        '&raised': {
          backgroundColor: 'red',
          color: 'white'
        }
      }
    }];

    const addRule = spy();

    chainedPlugin.transformDeclarationHook(
      '&raised',
      {
        backgroundColor: 'red',
        color: 'white'
      },
      rules[0],
      { addRule }
    );

    assert.strictEqual(
      rules[0].declaration['&raised'],
      undefined,
      'should remove the chained key'
    );

    assert.strictEqual(addRule.callCount, 1, 'should call add rule');

    const chainedRuleDefinition = {
      name: 'raised',
      declaration: {
        backgroundColor: 'red',
        color: 'white'
      },
      chainedTo: 'primary'
    };

    assert.strictEqual(
      addRule.calledWith(chainedRuleDefinition, true),
      true,
      'should call add rule with the chained args'
    );

    const chainedRule = {
      name: 'raised',
      type: 'style',
      selectorText: '.raised',
      declaration: {
        backgroundColor: 'red',
        color: 'white'
      }
    };

    chainedPlugin.addRuleHook(
      chainedRule,
      { rules, ruleDefinition: chainedRuleDefinition }
    );

    assert.strictEqual(chainedRule.selectorText, '.raised.primary');
  });
});
