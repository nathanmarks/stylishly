/* eslint-env mocha */
import { assert } from 'chai';
import { createStyleSheet, getClassNames } from 'packages/stylishly/src/styleSheet';
import { createPluginRegistry } from 'packages/stylishly/src/pluginRegistry';

describe('basic styles', () => {
  it('should create a rule and expose the className', () => {
    const pluginRegistry = createPluginRegistry();
    pluginRegistry.registerPlugins();

    const styleSheet = createStyleSheet('Button', () => {
      return {
        root: {
          color: 'red',
        },
      };
    });

    const rules = styleSheet.resolveStyles({}, pluginRegistry);

    assert.strictEqual(rules.length, 1, 'has 1 rule');
    assert.strictEqual(rules[0].type, 'style');
    assert.strictEqual(rules[0].selectorText, '.button__root');
    assert.strictEqual(rules[0].declaration.color, 'red');

    const classes = getClassNames(rules);

    assert.strictEqual(Object.keys(classes).length, 1, 'should return 1 class name');
    assert.strictEqual(classes.root, 'button__root', 'should have the root className');
  });

  it('should create 2 rules and expose the classNames', () => {
    const pluginRegistry = createPluginRegistry();
    pluginRegistry.registerPlugins();

    const styleSheet = createStyleSheet('Button', () => {
      return {
        root: {
          color: 'red',
        },
        primary: {
          color: 'blue',
        },
      };
    });

    const rules = styleSheet.resolveStyles({}, pluginRegistry);

    assert.strictEqual(rules.length, 2, 'has 2 rules');

    assert.strictEqual(rules[0].type, 'style');
    assert.strictEqual(rules[0].selectorText, '.button__root');
    assert.strictEqual(rules[0].declaration.color, 'red');

    assert.strictEqual(rules[1].type, 'style');
    assert.strictEqual(rules[1].selectorText, '.button__primary');
    assert.strictEqual(rules[1].declaration.color, 'blue');

    const classes = getClassNames(rules);

    assert.strictEqual(Object.keys(classes).length, 2, 'should return 2 class names');
    assert.strictEqual(classes.root, 'button__root', 'should have the root className');
    assert.strictEqual(classes.primary, 'button__primary', 'should have the primary className');
  });

  it('should create 2 rules with theme ID suffixes and expose the classNames', () => {
    const pluginRegistry = createPluginRegistry();
    pluginRegistry.registerPlugins();

    const styleSheet = createStyleSheet('Button', () => {
      return {
        root: {
          color: 'red',
        },
        primary: {
          color: 'blue',
        },
      };
    });

    const rules = styleSheet.resolveStyles({ id: 'abc' }, pluginRegistry);

    assert.strictEqual(rules.length, 2, 'has 2 rules');

    assert.strictEqual(rules[0].type, 'style');
    assert.strictEqual(rules[0].selectorText, '.button__root--abc');
    assert.strictEqual(rules[0].declaration.color, 'red');

    assert.strictEqual(rules[1].type, 'style');
    assert.strictEqual(rules[1].selectorText, '.button__primary--abc');
    assert.strictEqual(rules[1].declaration.color, 'blue');

    const classes = getClassNames(rules);

    assert.strictEqual(Object.keys(classes).length, 2, 'should return 2 class names');
    assert.strictEqual(classes.root, 'button__root--abc', 'should have the root className');
    assert.strictEqual(classes.primary, 'button__primary--abc', 'should have the primary className');
  });
});
