/* eslint-env mocha */
import { assert } from 'chai';
import units from './units';

describe('plugins/units.js', () => {
  const unitsPlugin = units();

  it('should add units where applicable', () => {
    const rule = {
      name: 'button',
      type: 'style',
      selectorText: '.button',
      declaration: {
        display: 'flex',
        width: 45,
        height: 100,
        lineHeight: 1
      }
    };

    unitsPlugin.transformDeclarationHook('width', 45, rule);
    unitsPlugin.transformDeclarationHook('height', 100, rule);
    unitsPlugin.transformDeclarationHook('lineHeight', 1, rule);

    assert.strictEqual(rule.declaration.width, '45px');
    assert.strictEqual(rule.declaration.height, '100px');
    assert.strictEqual(rule.declaration.lineHeight, 1);
  });
});
