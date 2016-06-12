import { find } from 'stylishly-utils/lib/helpers';

const ruleNameRegexp = /^[a-zA-Z0-9_-]+$/;

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

    if (isParent(key)) {
      delete rule.declaration[key];
      const descendantRuleDefinition = {
        ...ruleDefinition,
        declaration: value,
        descendantOf: key.replace(/\s?&$/, '')
      };
      addRule(descendantRuleDefinition);
      return false;
    } else if (value && typeof value === 'object' && ruleNameRegexp.test(key)) {
      delete rule.declaration[key];
      const descendantRuleDefinition = {
        name: key,
        declaration: value,
        descendantOf: rule.name
      };
      addRule(descendantRuleDefinition, true);
      return false;
    }

    return true;
  }

  return { addRuleHook, transformDeclarationHook };
}

export function isParent(key) {
  return key.substr(-1, 1) === '&';
}
