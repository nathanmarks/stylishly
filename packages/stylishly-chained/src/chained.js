import { find } from 'stylishly/lib/utils/helpers';

const chainedRegexp = /^&\s?(.+)/;

export default function chained() {
  function parseRuleHook(rule) {
    const matches = rule.name.match(chainedRegexp);
    if (matches !== null) {
      rule.name = matches[1];
      rule.chained = true;
    }
  }

  function resolveSelectorHook(selectorText, name, rule, sheetInterface) {
    const { rules, ruleDefinition } = sheetInterface;
    if (rule.chained) {
      const chainer = find(rules, ruleDefinition.parent);
      return `${chainer.selectorText}${selectorText}`;
    }
    return selectorText;
  }

  return { parseRuleHook, resolveSelectorHook };
}
