import { find } from 'stylishly-utils/lib/helpers';

export default function chained() {
  function resolveSelectorHook(selectorText, name, rule, sheetInterface) {
    const { rules, ruleDefinition } = sheetInterface;
    if (rule.type === 'style' && isChained(name) && ruleDefinition.parent) {
      const chainer = find(rules, ruleDefinition.parent);
      return `${chainer.selectorText}${selectorText.replace('&', '')}`;
    }
    return selectorText;
  }

  return { resolveSelectorHook };
}

const chainedRegexp = /^&\s?[a-z0-9-_:]+/i;

export function isChained(key) {
  return chainedRegexp.test(key);
}
