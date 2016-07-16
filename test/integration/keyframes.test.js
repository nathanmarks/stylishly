/* eslint-env mocha */
import { assert } from 'chai';
import { createStyleSheet, getClassNames } from 'packages/stylishly/src/styleSheet';
import { createPluginRegistry } from 'packages/stylishly/src/pluginRegistry';
import nested from 'packages/stylishly-nested/src/nested';
import atRules from 'packages/stylishly-at-rules/src/atRules';

describe('keyframes', () => {
  it('should add the keyframes rule', () => {
    const pluginRegistry = createPluginRegistry();
    pluginRegistry.registerPlugins(
      nested(),
      atRules()
    );

    const styleSheet = createStyleSheet('Foo', () => {
      return {
        '@keyframes my-animation': {
          '0%': {
            top: 0,
          },
          '50%': {
            top: 50,
          },
        },
      };
    });

    const rules = styleSheet.resolveStyles({}, pluginRegistry);
    const classes = getClassNames(rules);

    assert.strictEqual(rules.length, 3, 'has 3 rules');
    assert.strictEqual(Object.keys(classes).length, 0, 'should return 0 class names');
    assert.strictEqual(rules[0].type, 'keyframes');
    assert.strictEqual(rules[0].keyframesText, '@keyframes my-animation');
    assert.strictEqual(rules[1].selectorText, '0%');
    assert.strictEqual(rules[1].declaration.top, 0);
    assert.strictEqual(rules[1].parent, rules[0]);
    assert.strictEqual(rules[2].selectorText, '50%');
    assert.strictEqual(rules[2].declaration.top, 50);
    assert.strictEqual(rules[2].parent, rules[0]);
  });
});
