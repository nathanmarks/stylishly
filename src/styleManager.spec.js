/* eslint-env mocha */
import { assert } from 'chai';
import { spy } from 'sinon';
import { createStyleManager } from './styleManager';
import { createStyleSheet } from './styleSheet';

describe('styleManager.js', () => {
  describe('createStyleManager()', () => {
    const renderer = {
      renderSheet: spy()
    };
    const sheetMap = [];
    const styleManager = createStyleManager({
      renderer,
      sheetMap
    });

    it('should create an object with several functions', () => {
      assert.strictEqual(typeof styleManager, 'object');
      assert.strictEqual(typeof styleManager.render, 'function');
    });

    describe('render()', () => {
      it('should render a sheet using the renderer and return the classes', () => {
        const styleSheet = createStyleSheet('Foo', () => ({
          base: {
            backgroundColor: 'red'
          }
        }));

        const classes = styleManager.render(styleSheet);

        assert.strictEqual(renderer.renderSheet.callCount, 1, 'should call renderSheet() on the renderer');
        assert.strictEqual(sheetMap.length, 1, 'should add a sheetMap item');
        assert.strictEqual(classes.base, 'foo__base');
      });
    });
  });
});
