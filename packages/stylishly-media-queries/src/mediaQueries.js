
export default function mediaQueries() {
  function addRuleHook(rule, sheetInterface) {
    const { ruleDefinition } = sheetInterface;
    if (rule.type === 'style' && ruleDefinition.pseudoClass) {
      if (Array.isArray(ruleDefinition.pseudoClass)) {
        rule.selectorText = ruleDefinition.pseudoClass
          .map((pseudoClass) => `${rule.selectorText}:${pseudoClass}`)
          .join(',');
      } else {
        rule.selectorText = `${rule.selectorText}:${ruleDefinition.pseudoClass}`;
      }
    }
  }


  // rule.mediaText = name;
  // Object.keys(declaration).forEach((n) => {
  //   const def = { name: n, declaration: declaration[n], parent: rule };
  //   addRule(rules, styleSheet, theme, pluginRegistry, def, true);
  // });

  return { addRuleHook };
}

export function isMediaQuery(ruleName) {
  return ruleName.substr(0, 6) === '@media';
}
