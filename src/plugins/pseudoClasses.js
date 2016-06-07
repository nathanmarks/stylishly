
export default function pseudoClasses() {
  function addRuleHook(rule, sheetInterface) {
    const { ruleDefinition } = sheetInterface;
    if (rule.type === 'style' && ruleDefinition.pseudoClass) {
      rule.selectorText = `${rule.selectorText}:${ruleDefinition.pseudoClass}`;
    }
  }

  function transformDeclarationHook(key, value, rule, sheetInterface) {
    const { addRule, ruleDefinition } = sheetInterface;
    if (isPseudoClass(key)) {
      delete rule.declaration[key];
      const pseudoClassRuleDefinition = {
        ...ruleDefinition,
        declaration: value,
        pseudoClass: key.replace(/^&\s?:/, '')
      };
      addRule(pseudoClassRuleDefinition);
      return false;
    }
    return true;
  }

  return { addRuleHook, transformDeclarationHook };
}

export function isPseudoClass(key) {
  return /^&\s?:/.test(key);
}
