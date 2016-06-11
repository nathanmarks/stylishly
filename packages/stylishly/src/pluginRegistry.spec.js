/* eslint-env mocha */
import { assert } from 'chai';
import { createPluginRegistry } from './pluginRegistry';

describe('pluginRegistry.js', () => {
  describe('createPluginRegistry()', () => {
    const pluginRegistry = createPluginRegistry();
    it('should return an object', () => {
      assert.strictEqual(typeof pluginRegistry, 'object');
    });
  });

  describe('pluginRegistry', () => {
    it('should registry plugin hooks and call them in order', () => {
      const pluginRegistry = createPluginRegistry();

      const dummyPlugin1 = {
        addRuleHook(rule) {
          if (rule.type === 'style') {
            rule.dummy = true;
          }
        }
      };

      const dummyPlugin2 = {
        addRuleHook(rule) {
          if (rule.dummy) {
            rule.declaration.display = 'none';
          }
        }
      };

      assert.strictEqual(typeof pluginRegistry.registerPlugins, 'function');

      // registry a plugin
      pluginRegistry.registerPlugins(dummyPlugin1);
      pluginRegistry.registerPlugins(dummyPlugin2);

      const rule = {
        type: 'style',
        declaration: {
          color: 'red',
          display: 'flex'
        }
      };

      pluginRegistry.addRuleHook(rule);

      assert.strictEqual(rule.dummy, true, 'should have set the dummy property on the rule definition');
      assert.strictEqual(rule.declaration.display, 'none', 'should have set display to none');
    });
  });
});
