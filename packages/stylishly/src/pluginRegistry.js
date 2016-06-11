/**
 * pluginRegistry module. Used to create pluginRegistry objects.
 *
 * @module pluginRegistry
 */

/**
 * Creates a plugin registry
 *
 * @param  {...Object} [initialPlugins]               - Plugins for initial registration.
 * @return {module:pluginRegistry~pluginRegistry} - pluginRegistry
 */
export function createPluginRegistry(...initialPlugins) {
  const hooks = {
    addRuleHook: [],
    transformDeclarationHook: []
  };

  const hookFns = {};

  Object.keys(hooks).forEach((hook) => {
    hookFns[hook] = applyPlugins(hook);
  });

  // Register initial plugins if passed in
  if (initialPlugins) {
    registerPlugins(...initialPlugins);
  }


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
   * @memberOf module:pluginRegistry~pluginRegistry
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
      for (let i = 0; i < hooks[hook].length; i++) {
        if (hooks[hook][i](...args) === false) {
          break;
        }
      }
    };
  }

  return pluginRegistry;
}
