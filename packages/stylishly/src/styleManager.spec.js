/* eslint-env mocha */
import { assert } from 'chai';
import { spy, stub } from 'sinon';
import { createStyleManager } from './styleManager';
import { createStyleSheet } from './styleSheet';

describe('styleManager.js', () => {
  describe('createStyleManager()', () => {
    const renderer = {
      renderSheet: spy(),
      getSheets: stub().returns([{
        id: 'sheet1',
        rules: [{
          type: 'style',
          name: 'titanic',
          selectorText: '.foo__titanic',
          declaration: { float: 'none' },
          className: 'foo__titanic',
        }],
      }]),
    };
    const sheetMap = [];
    const styleManager = createStyleManager({
      renderer,
      sheetMap,
    });

    it('should create an object with several functions', () => {
      assert.strictEqual(typeof styleManager, 'object');
      assert.strictEqual(typeof styleManager.render, 'function');
    });

    describe('render()', () => {
      it('should render a sheet using the renderer and return the classes', () => {
        const styleSheet = createStyleSheet('Foo', () => ({
          base: {
            backgroundColor: 'red',
          },
        }));

        const classes = styleManager.render(styleSheet);

        assert.strictEqual(renderer.renderSheet.callCount, 1, 'should call renderSheet() on the renderer');
        assert.strictEqual(sheetMap.length, 1, 'should add a sheetMap item');
        assert.strictEqual(classes.base, 'foo__base');
      });
    });

    describe('renderSheetsToString()', () => {
      it('should render all the sheets to a string', () => {
        const expected = styleManager.renderSheetsToString();

        assert.strictEqual(
          expected,
          '<style data-stylishly="default">.foo__titanic{float:none}</style>',
          'should return the right string'
        );
      });
    });
  });
});
