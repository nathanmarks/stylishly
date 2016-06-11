import { kebabCase, transform } from 'stylishly-utils/lib/helpers';

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

export function addRule(rules, styleSheet, theme, pluginRegistry, ruleDefinition) {
  const { name, declaration, expose, parent } = ruleDefinition;
  const rule = {
    type: getRuleType(name)
  };
  rules.push(rule);

  /**
   * @TODO - move this to plugin
   */
  switch (rule.type) {
    case 'media':
      rule.mediaText = name;
      Object.keys(declaration).forEach((n) =>
        addRule(rules, styleSheet, theme, pluginRegistry, {
          name: n,
          declaration: declaration[n],
          expose: true,
          parent: rule
        })
      );
      break;

    case 'style':
    default:
      const kebabName = kebabCase(name);

      rule.name = name;
      rule.selectorText = `.${kebabName}`;
      rule.declaration = declaration;

      if (expose) {
        rule.className = kebabName;
      }
      if (parent) {
        rule.parent = parent;
      }

      break;
  }

  const sheetInterface = {
    addRule: addRule.bind(undefined, rules, styleSheet, theme, pluginRegistry),
    rules,
    styleSheet,
    theme,
    ruleDefinition
  };

  if (pluginRegistry) {
    if (rule.declaration) {
      Object.keys(rule.declaration).forEach((key) => {
        pluginRegistry.transformDeclarationHook(key, rule.declaration[key], rule, sheetInterface);
      });
    }
    pluginRegistry.addRuleHook(rule, sheetInterface);
  }

  return rule;
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
 * @TODO - move this to plugin
 */
export function getRuleType(rule) {
  let ruleName = rule;

  if (typeof rule === 'object') {
    ruleName = rule.name;
  }

  if (isAtRule(ruleName)) {
    if (isMediaQuery(ruleName)) {
      return 'media';
    }
  }

  return 'style';
}

/**
 * @TODO - move this to plugin
 */
export function isAtRule(ruleName) {
  return ruleName.substr(0, 1) === '@';
}

/**
 * @TODO - move this to plugin
 */
export function isMediaQuery(ruleName) {
  return ruleName.substr(0, 6) === '@media';
}
