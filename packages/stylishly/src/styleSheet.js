import { kebabCase, transform } from './utils/helpers';
import { createPluginRegistry } from './pluginRegistry';

/**
 * @module styleSheet
 */

/**
 * Core function used to create styleSheet objects
 *
 * @param  {string}   name          - Stylesheet name, should be unique
 * @param  {Function} callback      - Should return the raw rules object, is passed the theme as the first argument.
 * @param  {Object}   options       - Additional options
 * @param  {boolean}  options.group - A render group for this sheet. Dictates the DOM sheet the rules are rendered to.
 * @return {Object}                 - styleSheet object
 */
export function createStyleSheet(name, callback, options = {}) {
  const styleSheet = {};
  styleSheet.name = name;
  styleSheet.callback = callback;
  styleSheet.options = options;
  styleSheet.resolveStyles = (theme, pluginRegistry) => resolveStyles(styleSheet, theme, pluginRegistry);
  return styleSheet;
}

export function resolveStyles(styleSheet, theme = {}, pluginRegistry) {
  const rawStyles = styleSheet.callback(theme);
  return transform(rawStyles, (rules, declaration, name) => {
    addRule(rules, styleSheet, theme, pluginRegistry, { name, declaration, expose: true });
  }, []);
}

/**
 * Adds a rule to the rule array
 *
 * @private
 *
 * @param {Array}  rules          - Array of rules that have been added
 * @param {Object} styleSheet     - styleSheet object
 * @param {Object} theme          - theme object
 * @param {Object} pluginRegistry - plugin registry
 * @param {Object} ruleDefinition - rule description object
 */
export function addRule(rules, styleSheet, theme, pluginRegistry = createPluginRegistry(), ruleDefinition) {
  const { name, declaration } = ruleDefinition;

  const sheetInterface = {
    addRule: addRule.bind(undefined, rules, styleSheet, theme, pluginRegistry),
    rules,
    styleSheet,
    theme,
    ruleDefinition,
    pluginRegistry,
  };

  const rule = {};

  rule.name = name;
  rule.declaration = declaration;

  rules.push(rule);

  pluginRegistry.parseRuleHook(rule, sheetInterface);

  if (!rule.type) { // nothing else has claimed this rule, default to a style rule
    rule.type = 'style';
    rule.selectorText = resolveSelectorText(rule, sheetInterface);
  }

  Object.keys(rule.declaration).forEach((key) => {
    const value = rule.declaration[key];
    pluginRegistry.transformDeclarationHook(key, value, rule, sheetInterface);
  });

  pluginRegistry.addRuleHook(rule, sheetInterface);

  return rule;
}

export function resolveSelectorText(rule, sheetInterface) {
  const { name } = rule;
  const { theme, pluginRegistry, styleSheet, ruleDefinition } = sheetInterface;
  const expose = ruleDefinition ? ruleDefinition.expose : false;

  let selectorText;

  if (!name) {
    selectorText = '';
  } else if (isRawSelector(name)) {
    selectorText = name.replace(/.*?@raw\s?/, '');
  } else {
    let className = kebabCase(`${styleSheet.name}__${name}`);

    if (theme && theme.id) {
      className = `${className}--${theme.id}`;
    }

    if (expose) {
      rule.className = className;
    }

    selectorText = `.${className}`;
  }

  return pluginRegistry ?
    pluginRegistry.resolveSelectorHook.reduce(selectorText, name, rule, sheetInterface) :
    selectorText;
}

/**
 * Get an object of classNames from a set of rules
 *
 * @param  {Array}  rules  - set of rules
 * @return {Object}        - className mappings
 */
export function getClassNames(rules) {
  return rules.reduce((classNames, rule) => {
    if (rule.className && !classNames.hasOwnProperty(rule.name)) {
      classNames[rule.name] = rule.className;
    }
    return classNames;
  }, {});
}

/**
 * Check if a selector is raw
 *
 * @private
 *
 * @param  {string}  ruleName - rule name, should be the object key from the styles
 * @return {Boolean}
 */
function isRawSelector(ruleName) {
  return ruleName.indexOf('@raw') !== -1;
}
