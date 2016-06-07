import find from 'lodash/find';
// import hashObject from './utils/hashObject';
import { getRenderer } from './renderers';
import { createPluginRegistry, createDefaultPlugins } from './plugins';

export function createStyleManager({
  renderer = getRenderer(),
  pluginRegistry = createPluginRegistry(...createDefaultPlugins()),
  theme = {},
  sheetMap = []
} = {}) {
  /**
   * @TODO Write this shit
   *
   * @param  {Object} styleSheet - styleSheet object created by createStyleSheet()
   * @return {Object}            - classNames keyed by styleSheet property names
   */
  function render(styleSheet) {
    let mapping = find(sheetMap, { styleSheet });

    if (!mapping) {
      const rules = styleSheet.resolveStyles(theme, pluginRegistry);
      const classes = rules.map(getClassNames);
      mapping = {
        classes,
        styleSheet,
        ref: renderer.renderSheet(styleSheet.name, rules)
      };
      sheetMap.push(mapping);
    }

    return mapping.classes;
  }

  return { render };
}

export function getClassNames(rules) {
  return rules;
}

// export function mount(renderer, plugins, sheetMap, theme, styleSheet) {
//   let mapping = find(sheetMap, { styleSheet });

//   if (!mapping) {
//     const rawRuleDefinitions = styleSheet.createRuleDefinitions(theme);
//     const ruleDefinitions = applyPlugins(plugins, rawRuleDefinitions);
//     mapping = {
//       styleSheet,
//       counter: 0,
//       classes: ruleDefinitions.classes,
//       ref: renderer.render(ruleDefinitions, { id: hashObject(rawRuleDefinitions) })
//     };
//     sheetMap.push(mapping);
//   }

//   mapping.counter = mapping.counter + 1;

//   return mapping;
// }
