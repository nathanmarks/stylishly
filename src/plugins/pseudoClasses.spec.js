/* eslint-env mocha */
import { assert } from 'chai';
import { spy } from 'sinon';
import pseudoClasses from './pseudoClasses';

describe('plugins/pseudoClasses.js', () => {
  const pseudoClassesPlugin = pseudoClasses();

  it('should add the pseudo class rule', () => {
    const rule = {
      name: 'myButton',
      type: 'style',
      selectorText: 'my-button',
      declaration: {
        color: '#555',
        '&:hover': {
          color: '#111'
        }
      }
    };

    const addRule = spy();

    pseudoClassesPlugin.transformDeclarationHook(
      '&:hover',
      { color: '#111' },
      rule,
      { addRule }
    );

    assert.strictEqual(
      rule.declaration['&:hover'],
      undefined,
      'should remove the pseudo class key'
    );

    assert.strictEqual(
      addRule.calledWith({
        declaration: { color: '#111' },
        pseudoClass: 'hover'
      }),
      true,
      'should add an additional rule for the pseudo class'
    );
  });

  it('should add the pseudo class rule with multiple selectors', () => {
    const rule = {
      name: 'myButton',
      type: 'style',
      selectorText: 'my-button',
      declaration: {
        color: '#555',
        '&:hover, &:active': {
          color: '#111'
        }
      }
    };

    const addRule = spy();

    pseudoClassesPlugin.transformDeclarationHook(
      '&:hover, &:active',
      { color: '#111' },
      rule,
      { addRule }
    );

    assert.strictEqual(
      rule.declaration['&:hover, &:active'],
      undefined,
      'should remove the pseudo class key'
    );

    assert.strictEqual(
      addRule.calledWith({
        declaration: { color: '#111' },
        pseudoClass: ['hover', 'active']
      }),
      true,
      'should add an additional rule for the pseudo class'
    );
  });
});
