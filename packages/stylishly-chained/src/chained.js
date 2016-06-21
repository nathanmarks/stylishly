import { find } from 'stylishly-utils/lib/helpers';

export default function chained() {
  function resolveSelectorHook(selectorText, name, rule, sheetInterface) {
    const { rules, ruleDefinition } = sheetInterface;
    if (rule.type === 'style' && isChained(name) && ruleDefinition.parent) {
      const chainer = find(rules, ruleDefinition.parent);
      rule.name = rule.name.replace(chainedReplace, '');
      return `${chainer.selectorText}${selectorText}`;
    }
    return selectorText;
  }

  return { resolveSelectorHook };
}

const chainedRegexp = /^&\s?[a-z0-9-_:]+/i;
const chainedReplace = /^&\s?/;

export function isChained(key) {
  return chainedRegexp.test(key);
}
