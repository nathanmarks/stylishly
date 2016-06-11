/* eslint-env mocha */
import { assert } from 'chai';
import { createVirtualRenderer } from './virtualRenderer';

describe('renderers/virtualRenderer.js', () => {
  const renderer = createVirtualRenderer();
  const sheet1 = { id: 'sheet1', rules: {} };
  const sheet2 = { id: 'sheet2', rules: {} };

  it('should render sheets', (done) => {
    renderer.events.once('renderSheet', (id, rules) => {
      assert.strictEqual(id, sheet1.id);
      assert.strictEqual(rules, sheet1.rules);
      assert.strictEqual(renderer.getSheet(sheet1.id).id, sheet1.id);
      assert.strictEqual(renderer.getSheet(sheet1.id).rules, sheet1.rules);
      done();
    });

    renderer.renderSheet(sheet1.id, sheet1.rules);
  });

  it('should render more sheets', (done) => {
    renderer.events.once('renderSheet', (id, rules) => {
      assert.strictEqual(id, sheet2.id);
      assert.strictEqual(rules, sheet2.rules);
      assert.strictEqual(renderer.getSheet(sheet2.id).id, sheet2.id);
      assert.strictEqual(renderer.getSheet(sheet2.id).rules, sheet2.rules);
      assert.strictEqual(renderer.getSheets().length, 2);
      done();
    });

    renderer.renderSheet(sheet2.id, sheet2.rules);
  });

  it('should remove sheets', (done) => {
    renderer.events.once('removeSheet', (id) => {
      assert.strictEqual(id, sheet1.id);
      assert.strictEqual(renderer.getSheet(sheet2.id).id, sheet2.id);
      assert.strictEqual(renderer.getSheet(sheet2.id).rules, sheet2.rules);
      assert.strictEqual(renderer.getSheets().length, 1);
      done();
    });
    renderer.removeSheet(sheet1.id);
  });
});
