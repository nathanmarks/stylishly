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
    addRule(rules, styleSheet, theme, pluginRegistry, { name, declaration }, true);
  }, []);
}

export function addRule(rules, styleSheet, theme, pluginRegistry, ruleDefinition, expose = false) {
  const { name, declaration, parent } = ruleDefinition;
  const rule = {
    type: getRuleType(name)
  };

  rules.push(rule);

  const sheetInterface = {
    addRule: addRule.bind(undefined, rules, styleSheet, theme, pluginRegistry),
    rules,
    styleSheet,
    theme,
    ruleDefinition
  };

  /**
   * @TODO - move this to plugin
   */
  switch (rule.type) {
    case 'media':
      rule.mediaText = name;
      Object.keys(declaration).forEach((n) => {
        const def = { name: n, declaration: declaration[n], parent: rule };
        addRule(rules, styleSheet, theme, pluginRegistry, def, true);
      });
      break;

    case 'style':
    default:
      rule.name = name;
      rule.declaration = declaration;
      rule.selectorText = resolveSelectorText(rule, sheetInterface);

      if (expose) {
        rule.className = rule.selectorText.replace(/^\./, '');
      }

      if (parent) {
        rule.parent = parent;
      }

      break;
  }

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

export function resolveSelectorText(rule, sheetInterface) {
  const { styleSheet, theme } = sheetInterface;

  let selectorText;

  if (isRawSelector(rule.name)) {
    selectorText = rule.name.replace(/^@raw\s?/, '');
  } else {
    let className = `${styleSheet.prefix}__${kebabCase(rule.name)}`;

    if (theme && theme.id) {
      className = `${className}--${theme.id}`;
    }

    selectorText = `.${className}`;
  }

  return selectorText;
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

export function isAtRule(ruleName) {
  return ruleName.substr(0, 1) === '@';
}

export function isMediaQuery(ruleName) {
  return ruleName.substr(0, 6) === '@media';
}

export function isRawSelector(ruleName) {
  return ruleName.substr(0, 4) === '@raw';
}
