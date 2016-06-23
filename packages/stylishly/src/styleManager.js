import { find } from 'stylishly-utils/lib/helpers';
import { rulesToCSS } from 'stylishly-utils/lib/css';
import { getClassNames } from './styleSheet';
import { getRenderer } from './renderers';
import { createPluginRegistry } from './pluginRegistry';

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
  pluginRegistry = createPluginRegistry(),
  theme = {},
  sheetMap = []
} = {}) {
  /**
   * styleManager description
   *
   * @name styleManager
   * @type {Object}
   */
  const styleManager = {
    render,
    renderSheetsToString
  };

  function renderSheetsToString() {
    const sheets = renderer.getSheets().reduce((result, n) => {
      if (n.options && n.options.group) {
        if (!result[n.options.group]) {
          result[n.options.group] = '';
        }
        result[n.options.group] += rulesToCSS(n.rules);
      } else {
        result.default += rulesToCSS(n.rules);
      }
      return result;
    }, { default: '' });

    return Object.keys(sheets).map((n) => `<style data-stylishly="${n}">${sheets[n]}</style>`).join('');
  }

  /**
   * Some mundane desc
   *
   * @memberOf module:styleManager~styleManager
   * @param  {Object} styleSheet - styleSheet object created by createStyleSheet()
   * @return {Object}            - classNames keyed by styleSheet property names
   */
  function render(styleSheet, renderOptions) {
    let mapping = findMapping(sheetMap, styleSheet);

    if (!mapping) {
      const rules = styleSheet.resolveStyles(theme, pluginRegistry);
      const classes = getClassNames(rules);
      mapping = {
        classes,
        styleSheet,
        ref: renderer.renderSheet(styleSheet.name, rules, renderOptions)
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
