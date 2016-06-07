/* eslint-env mocha */
import { assert } from 'chai';
import { createStyleSheet, resolveStyles, getRuleType } from './styleSheet';

describe('styleSheet.js', () => {
  describe('createStyleSheet()', () => {
    const styleSheet = createStyleSheet(
      'Foo',
      (theme) => ({ base: { color: theme.color } })
    );

    it('should create a styleSheet object', () => {
      assert.ok(styleSheet);
    });

    describe('styleSheet object', () => {
      it('should have a name property', () => {
        assert.strictEqual(styleSheet.name, 'Foo', 'name property should be "Foo"');
      });
      it('should have a callback function', () => {
        assert.strictEqual(typeof styleSheet.callback, 'function');
      });
    });
  });

  describe('resolveStyles()', () => {
    describe('simple style resolution', () => {
      it('should resolve styles from a styleSheet using a theme object', () => {
        const styleSheet = createStyleSheet(
          'Foo',
          (theme) => ({ base: { color: theme.color } })
        );
        const rules = resolveStyles(styleSheet, { color: 'red' });
        assert.strictEqual(rules[0].name, 'base', 'should have the name');
        assert.strictEqual(rules[0].selectorText, '.base', 'should have the selectorText');
        assert.strictEqual(rules[0].declaration.color, 'red', 'should be the theme color');
      });

      it('should resolve multiple rules from a styleSheet', () => {
        const styleSheet = createStyleSheet(
          'Foo',
          (theme) => ({
            base: {
              color: theme.color,
              width: 100,
              height: 50,
              display: 'inline-block'
            },
            button: {
              color: '#ffffff'
            }
          })
        );
        const rules = resolveStyles(styleSheet, { color: 'red' });
        assert.strictEqual(rules[0].name, 'base');
        assert.strictEqual(rules[0].selectorText, '.base');
        assert.strictEqual(rules[0].declaration.color, 'red', 'should be the theme color');
        assert.strictEqual(rules[0].declaration.width, 100);
        assert.strictEqual(rules[0].declaration.height, 50);
        assert.strictEqual(rules[0].declaration.display, 'inline-block');

        assert.strictEqual(rules[1].name, 'button');
        assert.strictEqual(rules[1].selectorText, '.button');
        assert.strictEqual(rules[1].declaration.color, '#ffffff');
      });
    });

    // describe('resolving media queries', () => {
    //   it('should resolve a simple media query', () => {
    //     const styleSheet = createStyleSheet('Foo', () => {
    //       return {
    //         base: {
    //           width: '100%'
    //         },
    //         '@media (min-width: 800px)': {
    //           base: {
    //             width: '50%'
    //           }
    //         }
    //       };
    //     });
    //     const rules = resolveStyles(styleSheet, { id: 'abc' });

    //     assert.strictEqual(rules[0].name, 'base');
    //     assert.strictEqual(rules[0].type, 'style', 'should be a style rule');
    //     assert.strictEqual(rules[0].selectorText, 'foo__base--abc');

    //     assert.strictEqual(rules[1].type, 'media', 'should be a media query');
    //     assert.strictEqual(rules[1].mediaText, '@media (min-width: 800px)');
    //     assert.strictEqual(rules[1].children.length, 1);
    //     assert.strictEqual(rules[1].children[0].type, 'style', 'should be a style rule');
    //     assert.strictEqual(rules[1].children[0].selectorText, 'foo__base--abc');
    //   });
    // });
  });

  describe('getRuleType()', () => {
    it('should return the correct rule type for a rule name', () => {
      assert.strictEqual(getRuleType('@media (min-width: 800px)'), 'media');
      assert.strictEqual(getRuleType('woof'), 'style');
    });

    it('should return the correct rule type for a rule object', () => {
      assert.strictEqual(getRuleType({ name: '@media (min-width: 800px)' }), 'media');
      assert.strictEqual(getRuleType({ name: 'woof' }), 'style');
    });
  });
});
