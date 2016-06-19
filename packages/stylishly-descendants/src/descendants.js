import { find } from 'stylishly-utils/lib/helpers';

const ruleNameRegexp = /^[a-zA-Z0-9_-]+$/;

export default function descendants() {
  function resolveSelectorHook(selectorText, name, rule, sheetInterface) {
    const { rules, ruleDefinition } = sheetInterface;
    if (rule.type === 'style' && ruleDefinition.parent) {
      const ancestor = find(rules, ruleDefinition.parent);
      if (isParent(name)) {
        return `${selectorText.replace(/-&$/, '')} ${ancestor.selectorText}`;
      } else if (isChild(name)) {
        return `${ancestor.selectorText} ${selectorText.replace(/-&$/, '')}`;
      }
    }
    return selectorText;
  }

  return { resolveSelectorHook };
}

export function isParent(key) {
  return key.substr(-1, 1) === '&';
}

export function isChild(key) {
  return ruleNameRegexp.test(key);
}
