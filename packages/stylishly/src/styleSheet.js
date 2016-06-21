import { kebabCase, transform } from 'stylishly-utils/lib/helpers';
import { createPluginRegistry } from './pluginRegistry';

/**
 * @module styleSheet
 */

export function createStyleSheet(name, callback, options = {}) {
  const styleSheet = {};
  styleSheet.name = name;
  styleSheet.prefix = kebabCase(name);
  styleSheet.callback = callback;
  styleSheet.options = Object.assign({ global: false, named: true }, options);
  styleSheet.resolveStyles = (theme, pluginRegistry) => resolveStyles(styleSheet, theme, pluginRegistry);
  return styleSheet;
}

export function resolveStyles(styleSheet, theme = {}, pluginRegistry) {
  const rawStyles = styleSheet.callback(theme);
  return transform(rawStyles, (rules, declaration, name) => {
    addRule(rules, styleSheet, theme, pluginRegistry, { name, declaration, expose: true });
  }, []);
}

export function addRule(rules, styleSheet, theme, pluginRegistry = createPluginRegistry(), ruleDefinition) {
  const { name, declaration } = ruleDefinition;

  const sheetInterface = {
    addRule: addRule.bind(undefined, rules, styleSheet, theme, pluginRegistry),
    rules,
    styleSheet,
    theme,
    ruleDefinition,
    pluginRegistry
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

  if (name.indexOf(',') !== -1) {
    return name.split(',').map((n) => resolveSelector(n.trim(), rule, sheetInterface)).join(',');
  }

  return resolveSelector(name, rule, sheetInterface);
}

export function resolveSelector(name, rule, sheetInterface) {
  const { theme, pluginRegistry, styleSheet, ruleDefinition } = sheetInterface;
  const expose = ruleDefinition ? ruleDefinition.expose : false;

  let selectorText;

  if (isRawSelector(name)) {
    selectorText = name.replace(/^@raw\s?/, '');
  } else {
    let className = `${styleSheet.prefix}__${kebabCase(name.replace(/(\s|&)/g, ''))}`;

    if (theme && theme.id) {
      className = `${className}--${theme.id}`;
    }

    if (expose && !rule.className) {
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

export function isRawSelector(ruleName) {
  return ruleName.substr(0, 4) === '@raw';
}
