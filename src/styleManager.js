import { find } from './utils/helpers';
// import hashObject from './utils/hashObject';
import { getClassNames } from './styleSheet';
import { getRenderer } from './renderers';
import { createPluginRegistry, createDefaultPlugins } from './plugins';

/**
 * styleManager module. Used to create styleManager objects.
 *
 * @module styleManager
 */

/**
 * Creates a new styleManager
 *
 * @example
 *
 * ```javascript
 * import { createStyleManager } from 'stylishly/styleManager';
 * const styleManager = createStyleManager();
 * ```
 *
 * @param  {Object} [options={}]
 * @param  {Object} [options.renderer=defaultRenderer]      - Creates a virtual or DOM renderer.
 * @param  {Object} [options.pluginRegistry=pluginRegistry] - A plugin registry, all features enabled by default.
 * @param  {Object} [options.theme={}]                      - Theme object
 * @return {module:styleManager~styleManager}               - styleManager
 */
export function createStyleManager({
  renderer = getRenderer(),
  pluginRegistry = createPluginRegistry(...createDefaultPlugins()),
  theme = {},
  sheetMap = []
} = {}) {
  /**
   * styleManager description
   *
   * @name styleManager
   * @type {Object}
   */
  const styleManager = { render };

  /**
   * Some mundane desc
   *
   * @memberOf module:styleManager~styleManager
   * @param  {Object} styleSheet - styleSheet object created by createStyleSheet()
   * @return {Object}            - classNames keyed by styleSheet property names
   */
  function render(styleSheet) {
    let mapping = findMapping(sheetMap, styleSheet);

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

  return styleManager;
}

export function findMapping(sheetMap, styleSheet) {
  return find(sheetMap, { styleSheet }); // || find(sheetMap, { styleSheet: { name: styleSheet.name } });
}
