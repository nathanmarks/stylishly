import forEach from 'lodash/forEach';

/**
 * pluginRegistry module. Used to create pluginRegistry objects.
 *
 * @module plugins/registry
 */

/**
 * Creates a plugin registry
 *
 * @param  {...Object} [initialPlugins]               - Plugins for initial registration.
 * @return {module:plugins/registry~pluginRegistry} - pluginRegistry
 */
export function createPluginRegistry(...initialPlugins) {
  // Register initial plugins if passed in
  if (initialPlugins) {
    registerPlugins(...initialPlugins);
  }

  const hooks = {
    addRuleHook: [],
    transformDeclarationHook: []
  };

  const hookFns = {};

  Object.keys(hooks).forEach((hook) => {
    hookFns[hook] = applyPlugins(hook);
  });

  /**
   * pluginRegistry description
   *
   * @name pluginRegistry
   * @type {Object}
   */
  const pluginRegistry = { ...hookFns, registerPlugins, hooks };

  /**
   * Register plugins
   *
   * @memberOf module:plugins/registry~pluginRegistry
   * @param  {...Object} plugins - Plugins to register
   */
  function registerPlugins(...plugins) {
    plugins.forEach((plugin) => {
      Object.keys(plugin).forEach((key) => {
        if (hooks[key]) {
          hooks[key].push(plugin[key]);
        }
      });
    });
  }

  /**
   * Create a function for running the given hook
   *
   * @private
   * @param  {string}   hook
   * @return {Function}
   */
  function applyPlugins(hook) {
    return function runHook(...args) {
      forEach(hooks[hook], ((callback) => callback(...args))); // use lodash forEach to exit early
    };
  }

  return pluginRegistry;
}
