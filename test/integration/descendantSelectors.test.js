/* eslint-env mocha */
import { assert } from 'chai';
import { createStyleSheet, getClassNames } from 'packages/stylishly/src/styleSheet';
import { createPluginRegistry } from 'packages/stylishly/src/pluginRegistry';
import nested from 'packages/stylishly-nested/src/nested';

describe('descendant selectors', () => {
  it('should create a rule with a nested descendant selector', () => {
    const pluginRegistry = createPluginRegistry();
    pluginRegistry.registerPlugins(nested());

    const styleSheet = createStyleSheet('Foo', () => {
      return {
        box: {
          background: 'green',
          label: {
            color: 'red',
          },
        },
      };
    });

    const rules = styleSheet.resolveStyles({}, pluginRegistry);

    assert.strictEqual(rules.length, 2, 'has 2 rules');
    assert.strictEqual(rules[0].type, 'style');
    assert.strictEqual(rules[0].selectorText, '.foo__box');
    assert.strictEqual(rules[0].declaration.background, 'green');
    assert.strictEqual(rules[1].type, 'style');
    assert.strictEqual(rules[1].selectorText, '.foo__box .foo__label');
    assert.strictEqual(rules[1].declaration.color, 'red');

    const classes = getClassNames(rules);

    assert.strictEqual(Object.keys(classes).length, 2, 'should return 2 class names');
    assert.strictEqual(classes.box, 'foo__box', 'should have the box className');
    assert.strictEqual(classes.label, 'foo__label', 'should have the label className');
  });

  it('should support reverse nested syntax', () => {
    const pluginRegistry = createPluginRegistry();
    pluginRegistry.registerPlugins(nested());

    const styleSheet = createStyleSheet('Foo', () => {
      return {
        label: {
          color: 'black',
          'box &': {
            color: 'red',
          },
        },
      };
    });

    const rules = styleSheet.resolveStyles({}, pluginRegistry);

    assert.strictEqual(rules.length, 2, 'has 2 rules');
    assert.strictEqual(rules[0].type, 'style');
    assert.strictEqual(rules[0].selectorText, '.foo__label');
    assert.strictEqual(rules[0].declaration.color, 'black');
    assert.strictEqual(rules[1].type, 'style');
    assert.strictEqual(rules[1].selectorText, '.foo__box .foo__label');
    assert.strictEqual(rules[1].declaration.color, 'red');

    const classes = getClassNames(rules);

    assert.strictEqual(Object.keys(classes).length, 2, 'should return 2 class names');
    assert.strictEqual(classes.box, 'foo__box', 'should have the box className');
    assert.strictEqual(classes.label, 'foo__label', 'should have the label className');
  });
});
