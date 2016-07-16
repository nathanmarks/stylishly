/* eslint-env mocha */
import { assert } from 'chai';
import { createStyleSheet, getClassNames } from 'packages/stylishly/src/styleSheet';
import { createPluginRegistry } from 'packages/stylishly/src/pluginRegistry';
import nested from 'packages/stylishly-nested/src/nested';
import pseudoClasses from 'packages/stylishly-pseudo-classes/src/pseudoClasses';

describe('complex selectors', () => {
  it('should create a rule with chained, descendant and pseudo selectors', () => {
    const pluginRegistry = createPluginRegistry();
    pluginRegistry.registerPlugins(nested(), pseudoClasses());

    const styleSheet = createStyleSheet('Foo', () => {
      return {
        button: {
          color: 'red',
          '&primary': {
            color: 'purple',
            '&:hover': {
              color: 'blue',
            },
          },
        },
      };
    });

    const rules = styleSheet.resolveStyles({}, pluginRegistry);

    assert.strictEqual(rules.length, 3, 'has 3 rules');
    assert.strictEqual(rules[0].type, 'style');
    assert.strictEqual(rules[0].selectorText, '.foo__button');
    assert.strictEqual(rules[0].declaration.color, 'red');
    assert.strictEqual(rules[1].type, 'style');
    assert.strictEqual(rules[1].selectorText, '.foo__button.foo__primary');
    assert.strictEqual(rules[1].declaration.color, 'purple');

    const classes = getClassNames(rules);

    assert.strictEqual(Object.keys(classes).length, 2, 'should return 2 class names');
    assert.strictEqual(classes.button, 'foo__button', 'should have the button className');
    assert.strictEqual(classes.primary, 'foo__primary', 'should have the primary className');
  });

  it('should create a rule with chained, reverse descendant and pseudo selectors', () => {
    const pluginRegistry = createPluginRegistry();
    pluginRegistry.registerPlugins(nested(), pseudoClasses());

    const styleSheet = createStyleSheet('Foo', () => {
      return {
        button: {
          color: 'green',
          'base &': {
            color: 'red',
            '&:hover': {
              color: 'blue',
            },
            '& primary': {
              color: 'purple',
            },
          },
        },
      };
    });

    const rules = styleSheet.resolveStyles({}, pluginRegistry);

    assert.strictEqual(rules.length, 4, 'has 4 rules');
    assert.strictEqual(rules[0].type, 'style');
    assert.strictEqual(rules[0].selectorText, '.foo__button');
    assert.strictEqual(rules[0].declaration.color, 'green');
    assert.strictEqual(rules[1].type, 'style');
    assert.strictEqual(rules[1].selectorText, '.foo__base .foo__button');
    assert.strictEqual(rules[1].declaration.color, 'red');
    assert.strictEqual(rules[2].type, 'style');
    assert.strictEqual(rules[2].selectorText, '.foo__base .foo__button:hover');
    assert.strictEqual(rules[2].declaration.color, 'blue');

    const classes = getClassNames(rules);

    assert.strictEqual(Object.keys(classes).length, 3, 'should return 3 class names');
    assert.strictEqual(classes.button, 'foo__button', 'should have the button className');
    assert.strictEqual(classes.primary, 'foo__primary', 'should have the primary className');
    assert.strictEqual(classes.base, 'foo__base', 'should have the base className');
  });
});
