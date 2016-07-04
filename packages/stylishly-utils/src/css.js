import hyphenateStyleName from 'hyphenate-style-name';

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
    const children = rules.filter((n) => n.parent === rule);
    return rule.mediaText + '{' + rulesToCSS(children, true) + '}';
  } else if (rule.type === 'keyframes') {
    const children = rules.filter((n) => n.parent === rule);
    return rule.keyframesText + '{' + rulesToCSS(children, true) + '}';
  }

  return '';
}

function declarationToCSS(declaration) {
  return Object.keys(declaration).reduce((css, property, index, properties) => {
    let value = declaration[property];
    const hyphenatedProperty = hyphenateStyleName(property);
    if (Array.isArray(value)) {
      value = value.join(';' + hyphenatedProperty + ':');
    }
    if (index !== properties.length - 1) {
      value = value + ';';
    }
    return css + hyphenatedProperty + ':' + value;
  }, '');
}
