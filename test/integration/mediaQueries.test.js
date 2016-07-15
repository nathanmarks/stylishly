/* eslint-env mocha */
import { assert } from 'chai';
import { createStyleSheet, getClassNames } from 'packages/stylishly/src/styleSheet';
import { createPluginRegistry } from 'packages/stylishly/src/pluginRegistry';
import nestedSelectors from 'packages/stylishly-nested-selectors/src/nestedSelectors';
import atRules from 'packages/stylishly-at-rules/src/atRules';

describe('media queries', () => {
  it('should add the media query rule', () => {
    const pluginRegistry = createPluginRegistry();
    pluginRegistry.registerPlugins(nestedSelectors(), atRules());

    const styleSheet = createStyleSheet('Foo', () => {
      return {
        '@media (min-width: 800px)': {
          titanic: {
            float: 'left',
          },
        },
      };
    });

    const rules = styleSheet.resolveStyles({}, pluginRegistry);
    const classes = getClassNames(rules);


    assert.strictEqual(rules.length, 2, 'has 2 rules');
    assert.strictEqual(Object.keys(classes).length, 1, 'should return 1 class name');
    assert.strictEqual(classes.titanic, 'foo__titanic', 'should have the correct className');
    assert.strictEqual(rules[0].type, 'media');
    assert.strictEqual(rules[0].mediaText, '@media (min-width: 800px)');
    assert.strictEqual(rules[1].selectorText, '.foo__titanic');
    assert.strictEqual(rules[1].declaration.float, 'left');
    assert.strictEqual(rules[1].parent, rules[0]);
  });

  it('should add the nested media query rule', () => {
    const pluginRegistry = createPluginRegistry();
    pluginRegistry.registerPlugins(nestedSelectors(), atRules());

    const styleSheet = createStyleSheet('Foo', () => {
      return {
        titanic: {
          '@media (min-width: 800px)': {
            float: 'left',
          },
        },
      };
    });

    const rules = styleSheet.resolveStyles({}, pluginRegistry);
    const classes = getClassNames(rules);


    assert.strictEqual(rules.length, 3, 'has 3 rules');
    assert.strictEqual(Object.keys(classes).length, 1, 'should return 1 class name');
    assert.strictEqual(classes.titanic, 'foo__titanic', 'should have the correct className');
    assert.strictEqual(rules[1].type, 'media');
    assert.strictEqual(rules[1].mediaText, '@media (min-width: 800px)');
    assert.strictEqual(rules[2].selectorText, '.foo__titanic');
    assert.strictEqual(rules[2].declaration.float, 'left');
    assert.strictEqual(rules[2].parent, rules[1]);
  });
});
