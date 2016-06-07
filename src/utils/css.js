import filter from 'lodash/filter';

export function rulesToCSS(rules, areChildren = false) {
  return rules.reduce((css, rule, index) => {
    if (!areChildren && rule.parent) {
      return css;
    }
    return css += ruleToCSS(rule, index, rules);
  }, '');
}

function ruleToCSS(rule, index, rules) {
  if (rule.type === 'style' && rule.declaration && Object.keys(rule.declaration).length) {
    return rule.selectorText + '{' + declarationToCSS(rule.declaration) + '}';
  } else if (rule.type === 'media') {
    const children = filter(rules, (n) => n.parent === rule);
    return rule.mediaText + '{' + rulesToCSS(children, true) + '}';
  }

  return '';
}

function declarationToCSS(declaration) {
  return Object.keys(declaration).reduce((css, property, index, properties) => {
    let value = declaration[property];
    if (Array.isArray(value)) {
      value = value.join(';' + property + ':');
    }
    if (index !== properties.length - 1) {
      value = value + ';';
    }
    return css + property + ':' + value;
  }, '');
}
