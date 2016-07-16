/* eslint-env mocha */
import { assert } from 'chai';
import { createStyleSheet, getClassNames } from 'packages/stylishly/src/styleSheet';
import { createPluginRegistry } from 'packages/stylishly/src/pluginRegistry';
import nested from 'packages/stylishly-nested/src/nested';
import descendants from 'packages/stylishly-descendants/src/descendants';
import pseudoClasses from 'packages/stylishly-pseudo-classes/src/pseudoClasses';
import chained from 'packages/stylishly-chained/src/chained';

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

  describe('nested', () => {
    it('should create 2 selectors with the same parent', () => {
      const pluginRegistry = createPluginRegistry();
      pluginRegistry.registerPlugins(nested(), descendants());

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
      assert.strictEqual(rules[1].selectorText, '.foo__bar .foo__fizz,.foo__bar .foo__buzz');
      assert.strictEqual(rules[1].declaration.color, 'red');

      const classes = getClassNames(rules);

      assert.strictEqual(Object.keys(classes).length, 3, 'should return 3 class names');
      assert.strictEqual(classes.bar, 'foo__bar', 'should have the bar className');
      assert.strictEqual(classes.fizz, 'foo__fizz', 'should have the fizz className');
      assert.strictEqual(classes.buzz, 'foo__buzz', 'should have the buzz className');
    });

    it('should create 2 rules with the same parent, one with a pseudo class', () => {
      const pluginRegistry = createPluginRegistry();
      pluginRegistry.registerPlugins(
        nested(),
        descendants(),
        pseudoClasses()
      );

      const styleSheet = createStyleSheet('Foo', () => {
        return {
          bar: {
            'fizz, buzz:hover': {
              color: 'red',
            },
          },
        };
      });

      const rules = styleSheet.resolveStyles({}, pluginRegistry);

      assert.strictEqual(rules.length, 2, 'has 2 rules');
      assert.strictEqual(rules[1].type, 'style');
      assert.strictEqual(rules[1].selectorText, '.foo__bar .foo__fizz,.foo__bar .foo__buzz:hover');
      assert.strictEqual(rules[1].declaration.color, 'red');

      const classes = getClassNames(rules);

      assert.strictEqual(Object.keys(classes).length, 3, 'should return 3 class names');
      assert.strictEqual(classes.bar, 'foo__bar', 'should have the bar className');
      assert.strictEqual(classes.fizz, 'foo__fizz', 'should have the fizz className');
      assert.strictEqual(classes.buzz, 'foo__buzz', 'should have the buzz className');
    });

    it('should create 2 rules with the same parent, one with a chained selector', () => {
      const pluginRegistry = createPluginRegistry();
      pluginRegistry.registerPlugins(
        nested(),
        descendants(),
        chained()
      );

      const styleSheet = createStyleSheet('Foo', () => {
        return {
          bar: {
            'fizz, & buzz': {
              color: 'red',
            },
          },
        };
      });

      const rules = styleSheet.resolveStyles({}, pluginRegistry);

      assert.strictEqual(rules.length, 2, 'has 2 rules');
      assert.strictEqual(rules[1].type, 'style');
      assert.strictEqual(rules[1].selectorText, '.foo__bar .foo__fizz,.foo__bar.foo__buzz');
      assert.strictEqual(rules[1].declaration.color, 'red');

      const classes = getClassNames(rules);

      assert.strictEqual(Object.keys(classes).length, 3, 'should return 3 class names');
      assert.strictEqual(classes.bar, 'foo__bar', 'should have the bar className');
      assert.strictEqual(classes.fizz, 'foo__fizz', 'should have the fizz className');
      assert.strictEqual(classes.buzz, 'foo__buzz', 'should have the buzz className');
    });

    it('should create 2 rules with the same parent, one with a pseudo class and one with a chained selector', () => {
      const pluginRegistry = createPluginRegistry();
      pluginRegistry.registerPlugins(
        nested(),
        descendants(),
        pseudoClasses(),
        chained()
      );

      const styleSheet = createStyleSheet('Foo', () => {
        return {
          bar: {
            'fizz:hover, & buzz': {
              color: 'red',
            },
          },
        };
      });

      const rules = styleSheet.resolveStyles({}, pluginRegistry);

      assert.strictEqual(rules.length, 2, 'has 2 rules');
      assert.strictEqual(rules[1].type, 'style');
      assert.strictEqual(rules[1].selectorText, '.foo__bar .foo__fizz:hover,.foo__bar.foo__buzz');
      assert.strictEqual(rules[1].declaration.color, 'red');

      const classes = getClassNames(rules);

      assert.strictEqual(Object.keys(classes).length, 3, 'should return 3 class names');
      assert.strictEqual(classes.bar, 'foo__bar', 'should have the bar className');
      assert.strictEqual(classes.fizz, 'foo__fizz', 'should have the fizz className');
      assert.strictEqual(classes.buzz, 'foo__buzz', 'should have the buzz className');
    });

    it('should create 2 rules with the same parent, one with a raw selector', () => {
      const pluginRegistry = createPluginRegistry();
      pluginRegistry.registerPlugins(
        nested(),
        descendants(),
        pseudoClasses()
      );

      const styleSheet = createStyleSheet('Foo', () => {
        return {
          bar: {
            'fizz, @raw .special-class': {
              color: 'red',
            },
          },
        };
      });

      const rules = styleSheet.resolveStyles({}, pluginRegistry);

      assert.strictEqual(rules.length, 2, 'has 2 rules');
      assert.strictEqual(rules[1].type, 'style');
      assert.strictEqual(rules[1].selectorText, '.foo__bar .foo__fizz,.foo__bar .special-class');
      assert.strictEqual(rules[1].declaration.color, 'red');

      const classes = getClassNames(rules);

      assert.strictEqual(Object.keys(classes).length, 2, 'should return 2 class names');
      assert.strictEqual(classes.bar, 'foo__bar', 'should have the bar className');
      assert.strictEqual(classes.fizz, 'foo__fizz', 'should have the fizz className');
    });
  });
});
