/* eslint-env mocha */
import { assert } from 'chai';
import { createStyleSheet, getClassNames } from 'packages/stylishly/src/styleSheet';
import { createPluginRegistry } from 'packages/stylishly/src/pluginRegistry';
import nested from 'packages/stylishly-nested/src/nested';
import pseudo from 'packages/stylishly-pseudo/src/pseudo';

describe('pseudo elements', () => {
  it('should create a rule with a pseudo element and expose the className', () => {
    const pluginRegistry = createPluginRegistry();
    pluginRegistry.registerPlugins(nested(), pseudo());

    const styleSheet = createStyleSheet('Foo', () => {
      return {
        'container::after': {
          color: 'red',
        },
      };
    });

    const rules = styleSheet.resolveStyles({}, pluginRegistry);

    assert.strictEqual(rules.length, 1, 'has 1 rule');
    assert.strictEqual(rules[0].type, 'style');
    assert.strictEqual(rules[0].selectorText, '.foo__container::after');
    assert.strictEqual(rules[0].declaration.color, 'red');

    const classes = getClassNames(rules);

    assert.strictEqual(Object.keys(classes).length, 1, 'should return 1 class name');
    assert.strictEqual(classes.container, 'foo__container', 'should have the container className');
  });
});
