import { find } from 'stylishly-utils/lib/helpers';

export default function chained() {
  function resolveSelectorHook(selectorText, name, rule, sheetInterface) {
    const { rules, ruleDefinition } = sheetInterface;
    if (rule.type === 'style' && isChained(name) && ruleDefinition.parent) {
      const chainer = find(rules, ruleDefinition.parent);

      if (rule.classNames) {
        Object.keys(rule.classNames).forEach((n) => removeChainedSyntax(rule.classNames[n]));
      } else if (rule.className) {
        removeChainedSyntax(rule);
      }

      return `${chainer.selectorText}${selectorText}`;
    }
    return selectorText;
  }

  return { resolveSelectorHook };
}

const chainedRegexp = /^&\s?.+/;
const chainedReplace = /^&\s?/;

function isChained(key) {
  return chainedRegexp.test(key);
}

function removeChainedSyntax(obj) {
  obj.name = obj.name.replace(chainedReplace, '');
  obj.className = obj.className.replace(chainedReplace, '');
}
