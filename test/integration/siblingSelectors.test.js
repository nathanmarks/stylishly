/* eslint-env mocha */
import { assert } from 'chai';
import { createStyleSheet, getClassNames } from 'packages/stylishly/src/styleSheet';
import { createPluginRegistry } from 'packages/stylishly/src/pluginRegistry';
import nested from 'packages/stylishly-nested/src/nested';

describe('sibling selectors', () => {
  it('should create rules with sibling selectors', () => {
    const pluginRegistry = createPluginRegistry();
    pluginRegistry.registerPlugins(nested());

    const styleSheet = createStyleSheet('Foo', () => {
      return {
        'button': {
          color: 'black',
          '+ help': {
            color: 'red',
          },
        },
      };
    });

    const rules = styleSheet.resolveStyles({}, pluginRegistry);

    assert.strictEqual(rules.length, 2, 'has 2 rules');
    assert.strictEqual(rules[0].type, 'style');
    assert.strictEqual(rules[0].selectorText, '.foo__button');
    assert.strictEqual(rules[0].declaration.color, 'black');

    assert.strictEqual(rules[1].type, 'style');
    assert.strictEqual(rules[1].selectorText, '.foo__button + .foo__help');
    assert.strictEqual(rules[1].declaration.color, 'red');

    const classes = getClassNames(rules);

    assert.strictEqual(Object.keys(classes).length, 2, 'should return 2 class names');
    assert.strictEqual(classes.button, 'foo__button', 'should have the button className');
    assert.strictEqual(classes.help, 'foo__help', 'should have the help className');
  });
});
