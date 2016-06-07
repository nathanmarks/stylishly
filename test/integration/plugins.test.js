/* eslint-env mocha */
import { assert } from 'chai';
import { createStyleSheet } from 'src/styleSheet';
import { createPluginRegistry } from 'src/plugins/registry';
import camelCase from 'src/plugins/camelCase';
import vendorPrefixer from 'src/plugins/vendorPrefixer';
import pseudoClasses from 'src/plugins/pseudoClasses';
import componentSelectors from 'src/plugins/componentSelectors';
import descendants from 'src/plugins/descendants';
import units from 'src/plugins/units';

describe('plugins', () => {
  describe('pseudoClasses', () => {
    it('should add the pseudo class rule', () => {
      const pluginRegistry = createPluginRegistry();
      pluginRegistry.registerPlugins(pseudoClasses());

      const styleSheet = createStyleSheet('Foo', () => {
        return {
          button: {
            color: 'red',
            '&:hover': {
              color: 'blue'
            }
          }
        };
      });

      const rules = styleSheet.resolveStyles({}, pluginRegistry);

      assert.strictEqual(rules.length, 2, 'has 2 rules');
      assert.strictEqual(rules[0].selectorText, '.button');
      assert.strictEqual(rules[0].declaration.color, 'red');
      assert.strictEqual(rules[1].selectorText, '.button:hover');
      assert.strictEqual(rules[1].declaration.color, 'blue');
    });
  });

  describe('descendants and componentSelectors', () => {
    it('should correctly apply descendant selectors and selector transformations', () => {
      const pluginRegistry = createPluginRegistry();

      pluginRegistry.registerPlugins(
        componentSelectors(),
        descendants()
      );

      const styleSheet = createStyleSheet('Foo', () => {
        return {
          base: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end'
          },
          button: {
            'base &': {
              color: 'red'
            }
          }
        };
      });

      const rules = styleSheet.resolveStyles({}, pluginRegistry);

      assert.strictEqual(rules[0].selectorText, '.foo__base');
      assert.strictEqual(rules[1].selectorText, '.foo__button');
      assert.strictEqual(rules[2].selectorText, '.foo__base .foo__button');
    });
  });

  describe('descendants, componentSelectors and pseudoClasses', () => {
    const pluginRegistry = createPluginRegistry();

    pluginRegistry.registerPlugins(
      componentSelectors(),
      descendants(),
      pseudoClasses()
    );

    const styleSheet = createStyleSheet('Foo', () => {
      return {
        base: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end'
        },
        button: {
          'base &': {
            color: 'red',
            '& :hover': {
              color: 'blue'
            }
          }
        }
      };
    });

    const rules = styleSheet.resolveStyles({}, pluginRegistry);

    it('should have 4 rules', () => assert.strictEqual(rules.length, 4));

    it('should correctly set selectorText', () => {
      assert.strictEqual(rules[0].selectorText, '.foo__base');
      assert.strictEqual(rules[1].selectorText, '.foo__button');
      assert.strictEqual(rules[2].selectorText, '.foo__base .foo__button');
      assert.strictEqual(rules[3].selectorText, '.foo__base .foo__button:hover');
    });
  });

  describe('the kitchen sink', () => {
    const pluginRegistry = createPluginRegistry();

    pluginRegistry.registerPlugins(
      componentSelectors(),
      descendants(),
      pseudoClasses(),
      units(),
      camelCase(),
      vendorPrefixer()
    );

    const styleSheet = createStyleSheet('Foo', () => {
      return {
        base: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end'
        },
        button: {
          'base &': {
            color: 'red',
            minWidth: 64,
            '& :hover': {
              color: 'blue'
            }
          }
        },
        titanic: {
          float: 'none'
        },
        '@media (min-width: 800px)': {
          titanic: {
            float: 'left'
          },
          button: {
            'base &': {
              minWidth: 'none'
            }
          }
        }
      };
    });

    const rules = styleSheet.resolveStyles({}, pluginRegistry);

    it('should have 9 rules', () => assert.strictEqual(rules.length, 9));

    it('should add all of the flexbox browser properties and hyphenate properties', () => {
      assert.strictEqual(rules[0].selectorText, '.foo__base');
      assert.deepEqual(rules[0].declaration, {
        display: [
          '-webkit-box',
          '-moz-box',
          '-ms-flexbox',
          '-webkit-flex',
          'flex'
        ],
        'align-items': 'center',
        'justify-content': 'flex-end',
        '-webkit-align-items': 'center',
        '-ms-flex-align': 'center',
        '-webkit-box-align': 'center',
        '-webkit-justify-content': 'flex-end',
        '-ms-flex-pack': 'end',
        '-webkit-box-pack': 'end'
      });
    });

    it('should add an empty declaration for the button', () => {
      assert.strictEqual(rules[1].selectorText, '.foo__button');
      assert.deepEqual(rules[1].declaration, {});
    });

    it('should add a descendant selector for button', () => {
      assert.strictEqual(rules[2].selectorText, '.foo__base .foo__button');
      assert.deepEqual(rules[2].declaration, { color: 'red', 'min-width': '64px' });
    });

    it('should add a descendant pseudo class selector for the hover state of button', () => {
      assert.strictEqual(rules[3].selectorText, '.foo__base .foo__button:hover');
      assert.deepEqual(rules[3].declaration, { color: 'blue' });
    });

    it('should sink the titanic', () => {
      assert.strictEqual(rules[4].selectorText, '.foo__titanic');
      assert.deepEqual(rules[4].declaration, { float: 'none' });
    });

    it('should be a media query', () => {
      assert.strictEqual(rules[5].type, 'media');
      assert.strictEqual(rules[5].mediaText, '@media (min-width: 800px)');
    });

    describe('inside the media query rule', () => {
      it('should be a rule to refloat the titanic', () => {
        assert.strictEqual(rules[6].parent, rules[5], 'should have the media query as a parent');
        assert.strictEqual(rules[6].selectorText, '.foo__titanic');
        assert.deepEqual(rules[6].declaration, { float: 'left' });
      });

      it('should be an empty button declaration (won\'t get rendered)', () => {
        assert.strictEqual(rules[7].parent, rules[5], 'should have the media query as a parent');
        assert.strictEqual(rules[7].selectorText, '.foo__button');
        assert.deepEqual(rules[7].declaration, {});
      });

      it('should be a rule to remove the minWidth from button', () => {
        assert.strictEqual(rules[8].parent, rules[5], 'should have the media query as a parent');
        assert.strictEqual(rules[8].selectorText, '.foo__base .foo__button');
        assert.deepEqual(rules[8].declaration, { 'min-width': 'none' });
      });
    });
  });
});
