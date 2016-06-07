import find from 'lodash/find';
import flowRight from 'lodash/flowRight';
import hashObject from './utils/hashObject';
import { getRenderer } from './renderers';

export function createStyleManager({
  renderer = getRenderer(),
  plugins = [],
  theme = {},
  sheetMap = []
} = {}) {
  const styleManager = {};



  return styleManager;
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
