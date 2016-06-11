/* eslint-env mocha */
import { assert } from 'chai';
import { rulesToCSS } from './css';

describe('utils/css.js', () => {
  describe('rulesToCSS', () => {
    it('should convert a simple rule to a CSS string', () => {
      const rule = {
        type: 'style',
        name: 'titanic',
        selectorText: '.foo__titanic',
        declaration: { float: 'none' },
        className: 'foo__titanic'
      };
      assert.strictEqual(rulesToCSS([rule]), '.foo__titanic{float:none}');
    });

    it('should parse media queries and correctly nest the inner rules', () => {
      const mediaQueryRule = {
        type: 'media',
        mediaText: '@media (min-width: 800px)'
      };

      const otherRules = [
        {
          type: 'style',
          name: 'titanic',
          selectorText: '.foo__titanic',
          declaration: { float: 'none', display: 'inline' },
          className: 'foo__titanic',
          parent: mediaQueryRule
        }, {
          type: 'style',
          name: 'victory',
          selectorText: '.foo__victory',
          declaration: { float: 'left', display: 'block' },
          className: 'foo__victory',
          parent: mediaQueryRule
        }
      ];

      const rules = [mediaQueryRule, ...otherRules];

      assert.strictEqual(
        rulesToCSS(rules),
        '@media (min-width: 800px){.foo__titanic{float:none;display:inline}.foo__victory{float:left;display:block}}'
      );
    });

    it('should convert rules with array values correctly', () => {
      const rule = {
        type: 'style',
        name: 'base',
        selectorText: '.foo__base',
        declaration: {
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
        },
        className: 'foo__base'
      };

      assert.strictEqual(
        rulesToCSS([rule]),
        '.foo__base{display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex;align-items:center;justify-content:flex-end;-webkit-align-items:center;-ms-flex-align:center;-webkit-box-align:center;-webkit-justify-content:flex-end;-ms-flex-pack:end;-webkit-box-pack:end}' // eslint-disable-line max-len
      );
    });
  });
});
