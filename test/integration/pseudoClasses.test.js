/* eslint-env mocha */
import { assert } from 'chai';
import { createStyleSheet, getClassNames } from 'packages/stylishly/src/styleSheet';
import { createPluginRegistry } from 'packages/stylishly/src/pluginRegistry';
import nested from 'packages/stylishly-nested/src/nested';
import pseudoClasses from 'packages/stylishly-pseudo-classes/src/pseudoClasses';

describe('pseudo classes', () => {
  it('should create a rule with a pseudo class and expose the className', () => {
    const pluginRegistry = createPluginRegistry();
    pluginRegistry.registerPlugins(nested(), pseudoClasses());

    const styleSheet = createStyleSheet('Foo', () => {
      return {
        'button:hover': {
          color: 'red',
        },
      };
    });

    const rules = styleSheet.resolveStyles({}, pluginRegistry);

    assert.strictEqual(rules.length, 1, 'has 1 rule');
    assert.strictEqual(rules[0].type, 'style');
    assert.strictEqual(rules[0].selectorText, '.foo__button:hover');
    assert.strictEqual(rules[0].declaration.color, 'red');

    const classes = getClassNames(rules);

    assert.strictEqual(Object.keys(classes).length, 1, 'should return 1 class name');
    assert.strictEqual(classes.button, 'foo__button', 'should have the button className');
  });

  it('should create a rule with a pseudo classes and expose the classNames', () => {
    const pluginRegistry = createPluginRegistry();
    pluginRegistry.registerPlugins(nested(), pseudoClasses());

    const styleSheet = createStyleSheet('Foo', () => {
      return {
        'button:hover, label:hover': {
          color: 'red',
        },
      };
    });

    const rules = styleSheet.resolveStyles({}, pluginRegistry);

    assert.strictEqual(rules.length, 1, 'has 1 rule');
    assert.strictEqual(rules[0].type, 'style');
    assert.strictEqual(rules[0].selectorText, '.foo__button:hover,.foo__label:hover');
    assert.strictEqual(rules[0].declaration.color, 'red');

    const classes = getClassNames(rules);

    assert.strictEqual(Object.keys(classes).length, 2, 'should return 2 class names');
    assert.strictEqual(classes.button, 'foo__button', 'should have the button className');
  });
});
