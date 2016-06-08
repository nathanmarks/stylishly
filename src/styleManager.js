import find from 'lodash/find';
// import hashObject from './utils/hashObject';
import { getRenderer } from './renderers';
import { createPluginRegistry, createDefaultPlugins } from './plugins';

/**
 * @module styleManager
 */

/**
 * Creates a new styleManager
 *
 * @param  {Object} options
 * @param  {Object} options.renderer       - A compatible renderer, defaults work.
 * @param  {Object} options.pluginRegistry - A plugin registry, all features enabled by default.
 * @param  {Object} options.theme          - Theme object
 * @param  {Array}  sheetMap               - You don't need to change this
 * @return {Object}                        - styleManager
 */
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
      const classes = getClassNames(rules);
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
  return rules.reduce((classNames, rule) => {
    if (rule.className && !classNames.hasOwnProperty(rule.name)) {
      classNames[rule.name] = rule.className;
    }
    return classNames;
  }, {});
}
