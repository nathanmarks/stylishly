/* eslint-env mocha */
import { assert } from 'chai';
import { createStyleSheet, getClassNames } from 'packages/stylishly/src/styleSheet';
import { createPluginRegistry } from 'packages/stylishly/src/pluginRegistry';
import nested from 'packages/stylishly-nested/src/nested';
import chained from 'packages/stylishly-chained/src/chained';

describe('chained classes', () => {
  it('should create rules with chained selectors and expose the classNames', () => {
    const pluginRegistry = createPluginRegistry();
    pluginRegistry.registerPlugins(nested(), chained());

    const styleSheet = createStyleSheet('Foo', () => {
      return {
        'button': {
          color: 'black',
          '& primary': {
            color: 'red',
          },
          '& accent': {
            color: 'blue',
          },
        },
      };
    });

    const rules = styleSheet.resolveStyles({}, pluginRegistry);

    assert.strictEqual(rules.length, 3, 'has 3 rules');
    assert.strictEqual(rules[0].type, 'style');
    assert.strictEqual(rules[0].selectorText, '.foo__button');
    assert.strictEqual(rules[0].declaration.color, 'black');

    assert.strictEqual(rules[1].type, 'style');
    assert.strictEqual(rules[1].selectorText, '.foo__button.foo__primary');
    assert.strictEqual(rules[1].declaration.color, 'red');

    assert.strictEqual(rules[2].type, 'style');
    assert.strictEqual(rules[2].selectorText, '.foo__button.foo__accent');
    assert.strictEqual(rules[2].declaration.color, 'blue');

    const classes = getClassNames(rules);

    assert.strictEqual(Object.keys(classes).length, 3, 'should return 3 class names');
    assert.strictEqual(classes.button, 'foo__button', 'should have the button className');
    assert.strictEqual(classes.primary, 'foo__primary', 'should have the primary className');
    assert.strictEqual(classes.accent, 'foo__accent', 'should have the accent className');
  });

  it.only('should create chained selectors with raw selectors', () => {
    const pluginRegistry = createPluginRegistry();
    pluginRegistry.registerPlugins(nested(), chained());

    const styleSheet = createStyleSheet('Foo', () => {
      return {
        'button': {
          color: 'black',
          '& @raw .special-class': {
            color: 'blue',
          },
          '& primary': {
            color: 'red',
          },
        },
      };
    });

    const rules = styleSheet.resolveStyles({}, pluginRegistry);

    assert.strictEqual(rules.length, 3, 'has 3 rules');
    assert.strictEqual(rules[0].type, 'style');
    assert.strictEqual(rules[0].selectorText, '.foo__button');
    assert.strictEqual(rules[0].declaration.color, 'black');

    assert.strictEqual(rules[1].type, 'style');
    assert.strictEqual(rules[1].selectorText, '.foo__button.special-class');
    assert.strictEqual(rules[1].declaration.color, 'blue');

    assert.strictEqual(rules[2].type, 'style');
    assert.strictEqual(rules[2].selectorText, '.foo__button.foo__primary');
    assert.strictEqual(rules[2].declaration.color, 'red');

    const classes = getClassNames(rules);

    assert.strictEqual(Object.keys(classes).length, 2, 'should return 2 class names');
    assert.strictEqual(classes.button, 'foo__button', 'should have the button className');
    assert.strictEqual(classes.primary, 'foo__primary', 'should have the primary className');
  });
});
