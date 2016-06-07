import find from 'lodash/find';

export default function descendants() {
  function addRuleHook(rule, sheetInterface) {
    const { rules, ruleDefinition } = sheetInterface;
    if (rule.type === 'style' && ruleDefinition.descendantOf) {
      const ancestor = find(rules, { name: ruleDefinition.descendantOf });
      rule.selectorText = `${ancestor.selectorText} ${rule.selectorText}`;
    }
  }

  function transformDeclarationHook(key, value, rule, sheetInterface) {
    const { addRule, ruleDefinition } = sheetInterface;

    if (isDescendant(key)) {
      delete rule.declaration[key];
      const descendantRuleDefinition = {
        ...ruleDefinition,
        declaration: value,
        descendantOf: key.replace(/\s?&$/, '')
      };
      addRule(descendantRuleDefinition);

      return false;
    }

    return true;
  }

  return { addRuleHook, transformDeclarationHook };
}

export function isDescendant(key) {
  return key.substr(-1, 1) === '&';
}
