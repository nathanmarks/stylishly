/* eslint-env mocha */
import { assert } from 'chai';
import { createStyleSheet, getClassNames } from 'packages/stylishly/src/styleSheet';
import { createPluginRegistry } from 'packages/stylishly/src/pluginRegistry';
import nested from 'packages/stylishly-nested/src/nested';

describe('multiple selectors', () => {
  it('should create a rule with multiple selectors and expose the classNames', () => {
    const pluginRegistry = createPluginRegistry();
    pluginRegistry.registerPlugins(nested());

    const styleSheet = createStyleSheet('Foo', () => {
      return {
        'fizz, buzz': {
          color: 'red',
        },
      };
    });

    const rules = styleSheet.resolveStyles({}, pluginRegistry);

    assert.strictEqual(rules.length, 1, 'has 1 rules');
    assert.strictEqual(rules[0].type, 'style');
    assert.strictEqual(rules[0].selectorText, '.foo__fizz,.foo__buzz');
    assert.strictEqual(rules[0].declaration.color, 'red');

    const classes = getClassNames(rules);

    assert.strictEqual(Object.keys(classes).length, 2, 'should return 2 class names');
    assert.strictEqual(classes.fizz, 'foo__fizz', 'should have the fizz className');
    assert.strictEqual(classes.buzz, 'foo__buzz', 'should have the buzz className');
  });

  it('should create a rule with nested multiple selectors and expose the classNames', () => {
    const pluginRegistry = createPluginRegistry();
    pluginRegistry.registerPlugins(nested());

    const styleSheet = createStyleSheet('Foo', () => {
      return {
        bar: {
          'fizz, buzz': {
            color: 'red',
          },
        },
      };
    });

    const rules = styleSheet.resolveStyles({}, pluginRegistry);

    assert.strictEqual(rules.length, 2, 'has 2 rules');
    assert.strictEqual(rules[1].type, 'style');
    assert.strictEqual(rules[1].selectorText, '.foo__fizz,.foo__buzz');
    assert.strictEqual(rules[1].declaration.color, 'red');

    const classes = getClassNames(rules);

    assert.strictEqual(Object.keys(classes).length, 2, 'should return 2 class names');
    assert.strictEqual(classes.fizz, 'foo__fizz', 'should have the fizz className');
    assert.strictEqual(classes.buzz, 'foo__buzz', 'should have the buzz className');
  });
});
