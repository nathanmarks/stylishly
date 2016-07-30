/* eslint-env mocha */
import { assert } from 'chai';
import { spy, stub } from 'sinon';
import { createStyleManager } from './styleManager';
import { createStyleSheet } from './styleSheet';

describe('styleManager.js', () => {
  describe('createStyleManager()', () => {
    let styleManager;
    let sheetMap;
    let renderer;

    before(() => {
      renderer = {
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
        renderSheetsToCSS: stub().returns({
          default: '.foo__titanic{float:none}',
        }),
      };
      sheetMap = [];
      styleManager = createStyleManager({
        theme: { color: 'red' },
        renderer,
        sheetMap,
      });
    });

    it('should create an object with several functions', () => {
      assert.strictEqual(typeof styleManager, 'object');
      assert.strictEqual(typeof styleManager.render, 'function');
    });

    describe('render()', () => {
      let styleSheet1;

      before(() => {
        styleSheet1 = createStyleSheet('Foo', () => ({
          base: {
            backgroundColor: 'red',
          },
        }));
      });

      it('should render a sheet using the renderer and return the classes', () => {
        const classes = styleManager.render(styleSheet1);

        assert.strictEqual(renderer.renderSheet.callCount, 1, 'should call renderSheet() on the renderer');
        assert.strictEqual(sheetMap.length, 1, 'should add a sheetMap item');
        assert.strictEqual(classes.base, 'foo__base');
      });

      it('should get the classes', () => {
        const classes = styleManager.getClasses(styleSheet1);
        assert.strictEqual(classes.base, 'foo__base');
      });

      it('should then throw a warning when rendering a sheet with the same name', () => {
        const styleSheet2 = createStyleSheet('Foo', () => ({
          base: {
            backgroundColor: 'red',
          },
        }));

        const warningSpy = spy(console, 'error');
        styleManager.render(styleSheet2);
        assert.strictEqual(
          warningSpy.calledWith('Warning: A styleSheet with the name Foo already exists.'),
          true
        );
      });
    });

    describe('renderSheetsToCSS()', () => {
      it('should render all the sheets to a string', () => {
        const expected = styleManager.renderSheetsToCSS();

        assert.deepEqual(
          expected,
          {
            default: '.foo__titanic{float:none}',
          },
          'should return the right string'
        );
      });
    });

    describe('prepareInline', () => {
      it('should prepare inline styles', () => {
        const styles = styleManager.prepareInline({
          display: 'block',
        });
        assert.deepEqual(styles, { display: 'block' }, 'should return the same');
      });

      it('should prepare inline styles with theme variables', () => {
        const styles = styleManager.prepareInline((theme) => ({
          display: 'block',
          color: theme.color,
        }));
        assert.deepEqual(styles, { display: 'block', color: 'red' }, 'should return themed styles');
      });
    });
  });
});
