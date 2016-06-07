import forEach from 'lodash/forEach';

export function createPluginRegistry() {
  const hooks = {
    addRuleHook: [],
    transformDeclarationHook: []
  };

  const hookFns = {};

  Object.keys(hooks).forEach((hook) => {
    hookFns[hook] = applyPlugins(hook);
  });

  function applyPlugins(hook) {
    return function runHook(...args) {
      forEach(hooks[hook], ((callback) => callback(...args))); // use lodash forEach to exit early
    };
  }

  function registerPlugins(...plugins) {
    plugins.forEach((plugin) => {
      Object.keys(plugin).forEach((key) => {
        if (hooks[key]) {
          hooks[key].push(plugin[key]);
        }
      });
    });
  }

  return { ...hookFns, registerPlugins };
}
