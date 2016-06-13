import { find } from 'stylishly-utils/lib/helpers';

export default function chained() {
  function addRuleHook(rule, sheetInterface) {
    const { rules, ruleDefinition } = sheetInterface;
    if (rule.type === 'style' && ruleDefinition.chainedTo) {
      const chainer = find(rules, { name: ruleDefinition.chainedTo });
      rule.selectorText = `${chainer.selectorText}${rule.selectorText}`;
    }
  }

  function transformDeclarationHook(key, value, rule, sheetInterface) {
    const { addRule } = sheetInterface;

    if (isChained(key)) {
      delete rule.declaration[key];
      const chainedRuleDefinition = {
        name: key,
        declaration: value,
        chainedTo: rule.name
      };
      addRule(chainedRuleDefinition, true);
      return false;
    }

    return true;
  }

  return { addRuleHook, transformDeclarationHook };
}

export function isChained(key) {
  return key.substr(0, 1) === '&';
}
