
export default function rawSelectors() {
  function addRuleHook(rule) {
    if (rule.type === 'style' && isRawSelector(rule.name)) {
      rule.selectorText = rule.name.replace(/^@raw\s?/, '');
    }
  }

  return { addRuleHook };
}

export function isRawSelector(ruleName) {
  return ruleName.substr(0, 4) === '@raw';
}

