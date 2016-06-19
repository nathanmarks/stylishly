/* eslint-env mocha */
import { assert } from 'chai';
import mediaQueries from './mediaQueries';

describe('plugins/mediaQueries.js', () => {
  const mediaQueriesPlugin = mediaQueries();

  it('should add mediaQueries where applicable', () => {
    const rule = {
      name: 'button',
      type: 'style',
      selectorText: '.button',
      declaration: {
        display: 'flex',
        width: 45,
        height: 100,
        lineHeight: 1,
        arrayProperty: [24, 48]
      }
    };

    unitsPlugin.transformDeclarationHook('width', 45, rule);
    unitsPlugin.transformDeclarationHook('height', 100, rule);
    unitsPlugin.transformDeclarationHook('lineHeight', 1, rule);
    unitsPlugin.transformDeclarationHook('arrayProperty', [24, 48], rule);

    assert.strictEqual(rule.declaration.width, '45px');
    assert.strictEqual(rule.declaration.height, '100px');
    assert.strictEqual(rule.declaration.lineHeight, 1);
    assert.strictEqual(rule.declaration.arrayProperty[0], '24px');
    assert.strictEqual(rule.declaration.arrayProperty[1], '48px');
  });
});
