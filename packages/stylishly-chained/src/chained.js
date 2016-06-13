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
    const { addRule, ruleDefinition } = sheetInterface;

    if (isChained(key)) {
      delete rule.declaration[key];
      const chainedRuleDefinition = {
        ...ruleDefinition,
        name: key.replace(/^&\s?/, ''),
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

const chainedRegexp = /^&\s?[a-z0-9-_]+/i;

export function isChained(key) {
  return chainedRegexp.test(key);
}
