
const pseudoRegexp = /^&\s?:/;

export default function pseudoClasses() {
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

  function transformDeclarationHook(key, value, rule, sheetInterface) {
    const { addRule, ruleDefinition } = sheetInterface;
    if (isPseudoClass(key)) {
      delete rule.declaration[key];
      const pseudoClassRuleDefinition = {
        ...ruleDefinition,
        declaration: value,
        pseudoClass: getPseudoClass(key)
      };
      addRule(pseudoClassRuleDefinition);
      return false;
    }
    return true;
  }

  return { addRuleHook, transformDeclarationHook };
}

export function isPseudoClass(key) {
  return pseudoRegexp.test(key);
}

export function getPseudoClass(key) {
  if (key.indexOf(',') !== -1) {
    return key.split(',').map((n) => n.trim().replace(pseudoRegexp, ''));
  }

  return key.replace(pseudoRegexp, '');
}
