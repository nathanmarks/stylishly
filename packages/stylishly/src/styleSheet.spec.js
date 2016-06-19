/* eslint-env mocha */
import { assert } from 'chai';
import {
  createStyleSheet,
  resolveStyles,
  getClassNames,
  resolveSelectorText
} from './styleSheet';

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
        assert.strictEqual(rules[0].selectorText, '.foo__base', 'should have the selectorText');
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
        assert.strictEqual(rules[0].selectorText, '.foo__base');
        assert.strictEqual(rules[0].declaration.color, 'red', 'should be the theme color');
        assert.strictEqual(rules[0].declaration.width, 100);
        assert.strictEqual(rules[0].declaration.height, 50);
        assert.strictEqual(rules[0].declaration.display, 'inline-block');

        assert.strictEqual(rules[1].name, 'button');
        assert.strictEqual(rules[1].selectorText, '.foo__button');
        assert.strictEqual(rules[1].declaration.color, '#ffffff');
      });
    });
  });

  describe('resolveSelectorText()', () => {
    it('should return a formatted selector', () => {
      const rule = {
        name: 'myButton',
        type: 'style',
        selectorText: 'my-button'
      };

      const selectorText = resolveSelectorText(rule, {
        styleSheet: { prefix: 'foo' },
        theme: { id: 'abc' }
      });

      assert.strictEqual(selectorText, '.foo__my-button--abc');
    });
  });

  describe('getClassNames()', () => {
    it('should resolve a className map from a set of rules', () => {
      const classes = getClassNames([
        { type: 'style',
          name: 'button',
          selectorText: '.foo__button',
          declaration: {},
          className: 'foo__button' },
        { type: 'style',
          name: 'button',
          selectorText: '.foo__base .foo__button',
          declaration: { color: 'red', 'min-width': '64px' },
          className: 'foo__button' },
        { type: 'style',
          name: 'button',
          selectorText: '.foo__base .foo__button:hover',
          declaration: { color: 'blue' },
          className: 'foo__button' },
        { type: 'style',
          name: 'titanic',
          selectorText: '.foo__titanic',
          declaration: { float: 'none' },
          className: 'foo__titanic' }
      ]);

      assert.strictEqual(classes.button, 'foo__button');
      assert.strictEqual(classes.titanic, 'foo__titanic');
    });
  });
});
