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
  sheetMap = [],
} = {}) {
  /**
   * styleManager description
   *
   * @name styleManager
   * @type {Object}
   */
  const styleManager = {
    theme,
    render,
    renderSheetsToHtmlString,
    replaceTheme,
    reset,
  };

  /**
   * Returns an object containing the current sheets in the renderer,
   * keyed by grouping (default is `default`) with a CSS string as the value
   *
   * @memberOf module:styleManager~styleManager
   * @return {Object} Object of CSS strings keyed by render group
   */
  function renderSheetsToHtmlString() {
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

    return sheets;
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
      const rules = styleSheet.resolveStyles(styleManager.theme, pluginRegistry);
      const classes = getClassNames(rules);
      const name = styleManager.theme.id ? `${styleSheet.name}-${styleManager.theme.id}` : styleSheet.name;
      mapping = { name, classes, styleSheet, renderOptions };
      renderer.renderSheet(name, rules, renderOptions);
      sheetMap.push(mapping);
    }

    return mapping.classes;
  }

  /**
   * Replace the current theme with a new theme
   *
   * @param  {Object}  newTheme    - New theme object
   * @param  {boolean} shouldReset - Set to true to reset the renderer
   */
  function replaceTheme(newTheme, shouldReset) {
    styleManager.theme = newTheme;
    if (shouldReset) {
      reset();
    }
  }

  /**
   * Reset the renderer and replace all existing style rules
   *
   * @memberOf module:styleManager~styleManager
   */
  function reset() {
    renderer.removeAll();
    const sheets = sheetMap.map(({ styleSheet, renderOptions }) => ({ styleSheet, renderOptions }));
    sheetMap = [];
    sheets.forEach((n) => render(...n));
  }

  return styleManager;
}

export function findMapping(sheetMap, styleSheet) {
  return find(sheetMap, { styleSheet }); // || find(sheetMap, { styleSheet: { name: styleSheet.name } });
}
