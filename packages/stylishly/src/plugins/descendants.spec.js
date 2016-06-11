/* eslint-env mocha */
import { assert } from 'chai';
import { spy } from 'sinon';
import descendants from './descendants';

describe('plugins/descendants.js', () => {
  const descendantsPlugin = descendants();

  it('should add the descendant rule', () => {
    const rules = [{
      name: 'base',
      type: 'style',
      selectorText: '.base',
      declaration: {
        display: 'flex'
      }
    }, {
      name: 'button',
      type: 'style',
      selectorText: '.button',
      declaration: {
        'base &': {
          color: '#111'
        }
      }
    }];

    const addRule = spy();

    descendantsPlugin.transformDeclarationHook(
      'base &',
      { color: '#111' },
      rules[1],
      { addRule }
    );

    assert.strictEqual(
      rules[1].declaration['base &'],
      undefined,
      'should remove the descendant key'
    );

    assert.strictEqual(addRule.callCount, 1, 'should call add rule');

    const descendantRuleDefinition = {
      declaration: { color: '#111' },
      descendantOf: 'base'
    };

    assert.strictEqual(
      addRule.calledWith(descendantRuleDefinition),
      true,
      'should call add rule with the descendant args'
    );

    const descendantRule = {
      name: rules[1].name,
      type: 'style',
      selectorText: rules[1].selectorText,
      declaration: { color: '#111' }
    };

    descendantsPlugin.addRuleHook(
      descendantRule,
      { rules, ruleDefinition: descendantRuleDefinition }
    );

    assert.strictEqual(descendantRule.selectorText, '.base .button');
  });
});
