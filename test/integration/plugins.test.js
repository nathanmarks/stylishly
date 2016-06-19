/* eslint-env mocha */
import { assert } from 'chai';
import { createStyleSheet } from 'packages/stylishly/src/styleSheet';
import { createPluginRegistry } from 'packages/stylishly/src/pluginRegistry';
import pseudoClasses from 'packages/stylishly-pseudo-classes/src/pseudoClasses';
import descendants from 'packages/stylishly-descendants/src/descendants';
import chained from 'packages/stylishly-chained/src/chained';
import nested from 'packages/stylishly-nested/src/nested';
import { createKitchenSinkSheet } from 'test/fixtures/styleSheets/kitchenSink';

describe('plugins', () => {
  describe('chained #1', () => {
    it('should add the chained rules', () => {
      const pluginRegistry = createPluginRegistry();
      pluginRegistry.registerPlugins(
        nested(),
        chained()
      );

      const styleSheet = createStyleSheet('Foo', () => {
        return {
          primary: {
            color: 'red',
            '&raised': {
              backgroundColor: 'red',
              color: 'white'
            },
            '& braised': {
              backgroundColor: 'black',
              color: 'black'
            }
          }
        };
      });

      const rules = styleSheet.resolveStyles({}, pluginRegistry);

      assert.strictEqual(rules.length, 3, 'has 2 rules');
      assert.strictEqual(rules[0].selectorText, '.foo__primary');
      assert.strictEqual(rules[0].declaration.color, 'red');
      assert.strictEqual(rules[1].selectorText, '.foo__primary.foo__raised');
      assert.strictEqual(rules[1].declaration.backgroundColor, 'red');
      assert.strictEqual(rules[1].declaration.color, 'white');
      assert.strictEqual(rules[2].selectorText, '.foo__primary.foo__braised');
      assert.strictEqual(rules[2].declaration.backgroundColor, 'black');
      assert.strictEqual(rules[2].declaration.color, 'black');
    });
  });

  describe('chained #1', () => {
    it('should add the chained rules', () => {
      const pluginRegistry = createPluginRegistry();
      pluginRegistry.registerPlugins(
        nested(),
        chained()
      );

      const styleSheet = createStyleSheet('Foo', () => {
        return {
          button: {
            color: 'red',
            '&accent': {
              color: 'blue'
            },
            '&secondary': {
              color: 'green'
            }
          }
        };
      });

      const rules = styleSheet.resolveStyles({}, pluginRegistry);

      assert.strictEqual(rules.length, 3, 'has 3 rules');
      assert.strictEqual(rules[0].selectorText, '.foo__button');
      assert.strictEqual(rules[0].declaration.color, 'red');
      assert.strictEqual(rules[1].selectorText, '.foo__button.foo__accent');
      assert.strictEqual(rules[1].declaration.color, 'blue');
      assert.strictEqual(rules[2].selectorText, '.foo__button.foo__secondary');
      assert.strictEqual(rules[2].declaration.color, 'green');
    });
  });

  describe('pseudoClasses and chained', () => {
    it('should add the chained pseudo class rules', () => {
      const pluginRegistry = createPluginRegistry();
      pluginRegistry.registerPlugins(
        nested(),
        pseudoClasses(),
        chained()
      );

      const styleSheet = createStyleSheet('Foo', () => {
        return {
          primary: {
            color: 'red',
            '&:hover': {
              backgroundColor: 'grey'
            },
            '&raised': {
              backgroundColor: 'red',
              color: 'white',
              '&:hover': {
                backgroundColor: 'darkred'
              }
            },
            '&braised': {
              backgroundColor: 'black',
              color: 'black'
            }
          }
        };
      });

      const rules = styleSheet.resolveStyles({}, pluginRegistry);

      assert.strictEqual(rules.length, 5, 'should have 5 rules');

      assert.strictEqual(rules[0].selectorText, '.foo__primary');
      assert.strictEqual(rules[0].declaration.color, 'red');

      assert.strictEqual(
        rules[1].selectorText,
        '.foo__primary:hover',
        'should have the hover pseudo class'
      );
      assert.strictEqual(rules[1].declaration.backgroundColor, 'grey');

      assert.strictEqual(rules[2].selectorText, '.foo__primary.foo__raised');
      assert.strictEqual(rules[2].declaration.backgroundColor, 'red');
      assert.strictEqual(rules[2].declaration.color, 'white');

      assert.strictEqual(rules[3].selectorText, '.foo__primary.foo__raised:hover');
      assert.strictEqual(rules[3].declaration.backgroundColor, 'darkred');

      assert.strictEqual(rules[4].selectorText, '.foo__primary.foo__braised');
      assert.strictEqual(rules[4].declaration.backgroundColor, 'black');
      assert.strictEqual(rules[4].declaration.color, 'black');
    });
  });

  describe('descendants and componentSelectors', () => {
    it('should correctly apply descendant selectors and selector transformations', () => {
      const pluginRegistry = createPluginRegistry();

      pluginRegistry.registerPlugins(
        nested(),
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
          },
          test: {
            fab: {
              fontSize: 24
            }
          }
        };
      });

      const rules = styleSheet.resolveStyles({}, pluginRegistry);
      assert.strictEqual(rules[0].selectorText, '.foo__base');
      assert.strictEqual(rules[1].selectorText, '.foo__button');
      assert.strictEqual(rules[2].selectorText, '.foo__base .foo__button');
      assert.strictEqual(rules[3].selectorText, '.foo__test');
      assert.strictEqual(rules[4].selectorText, '.foo__test .foo__fab');
    });
  });

  describe('descendants and pseudoClasses', () => {
    const pluginRegistry = createPluginRegistry();

    pluginRegistry.registerPlugins(
      nested(),
      descendants(),
      pseudoClasses(),
      chained()
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

  describe.only('the kitchen sink', () => {
    let rules;

    before(() => {
      const sink = createKitchenSinkSheet();
      rules = sink.rules;
    });

    it('should have 13 rules', () => assert.strictEqual(rules.length, 13));

    it('should add all of the flexbox browser properties', () => {
      assert.strictEqual(rules[0].selectorText, '.foo__base');
      assert.deepEqual(rules[0].declaration, {
        display: [
          '-webkit-box',
          '-moz-box',
          '-ms-flexbox',
          '-webkit-flex',
          'flex'
        ],
        alignItems: 'center',
        justifyContent: 'flex-end',
        WebkitAlignItems: 'center',
        msFlexAlign: 'center',
        WebkitBoxAlign: 'center',
        WebkitJustifyContent: 'flex-end',
        msFlexPack: 'end',
        WebkitBoxPack: 'end'
      });
    });

    it('should add an empty declaration for the button', () => {
      assert.strictEqual(rules[1].selectorText, '.foo__button');
      assert.deepEqual(rules[1].declaration, {});
    });

    it('should add a descendant selector for button', () => {
      assert.strictEqual(rules[2].selectorText, '.foo__base .foo__button');
      assert.deepEqual(rules[2].declaration, { color: 'red', 'minWidth': '64px' });
    });

    it('should add a descendant pseudo class selector for the hover state of button', () => {
      assert.strictEqual(rules[3].selectorText, '.foo__base .foo__button:hover');
      assert.deepEqual(rules[3].declaration, { color: 'blue' });
    });

    it('should add a chained descendant selector for the primary state of button in base', () => {
      assert.strictEqual(rules[4].selectorText, '.foo__base .foo__button.foo__primary');
      assert.deepEqual(rules[4].declaration, { color: 'purple' });
    });

    it('should sink the titanic', () => {
      assert.strictEqual(rules[5].selectorText, '.foo__titanic');
      assert.deepEqual(rules[5].declaration, { float: 'none' });
    });

    it('should be a media query', () => {
      assert.strictEqual(rules[6].type, 'media');
      assert.strictEqual(rules[6].mediaText, '@media (min-width: 800px)');
    });

    describe('inside the media query rule', () => {
      it('should be a rule to refloat the titanic', () => {
        assert.strictEqual(rules[7].parent, rules[6], 'should have the media query as a parent');
        assert.strictEqual(rules[7].selectorText, '.foo__titanic');
        assert.deepEqual(rules[7].declaration, { float: 'left' });
      });

      it('should be an empty button declaration (won\'t get rendered)', () => {
        assert.strictEqual(rules[8].parent, rules[6], 'should have the media query as a parent');
        assert.strictEqual(rules[8].selectorText, '.foo__button');
        assert.deepEqual(rules[8].declaration, {});
      });

      it('should be a rule to remove the minWidth from button', () => {
        assert.strictEqual(rules[9].parent, rules[6], 'should have the media query as a parent');
        assert.strictEqual(rules[9].selectorText, '.foo__base .foo__button');
        assert.deepEqual(rules[9].declaration, { 'minWidth': 'none' });
      });
    });

    it('should be the container', () => {
      assert.strictEqual(rules[10].selectorText, '.foo__container');
      assert.deepEqual(rules[10].declaration, { width: '20px' });
    });

    it('should be another media query', () => {
      assert.strictEqual(rules[11].type, 'media');
      assert.strictEqual(rules[11].mediaText, '@media (min-width: 500px)');
    });

    it('should have the bigger container inside the media query', () => {
      assert.strictEqual(rules[12].parent, rules[11], 'should have the media query as a parent');
      assert.strictEqual(rules[12].selectorText, '.foo__container');
      assert.deepEqual(rules[12].declaration, { width: '100px' });
    });
  });
});
