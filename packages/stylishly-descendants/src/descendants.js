import { find } from 'stylishly/lib/utils/helpers';

export default function descendants() {
  function resolveSelectorHook(selectorText, name, rule, sheetInterface) {
    const { rules, ruleDefinition } = sheetInterface;

    if (rule.type === 'style' && ruleDefinition.parent && ruleDefinition.parent.type === 'style') {
      const ancestor = find(rules, ruleDefinition.parent);
      if (isParent(name)) {
        return `${selectorText.replace(/-&$/, '')} ${ancestor.selectorText}`;
      } else if (isChild(name)) {
        rule.className = selectorText.replace(/^\./, '');
        return `${ancestor.selectorText} ${selectorText.replace(/-&$/, '')}`;
      }
    }

    return selectorText;
  }

  return { resolveSelectorHook };
}

function isParent(key) {
  return key.substr(-1, 1) === '&';
}

const ruleNameRegexp = /^[^&:]/;

function isChild(key) {
  return ruleNameRegexp.test(key);
}
