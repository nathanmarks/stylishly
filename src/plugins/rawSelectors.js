
export default function rawSelectors() {
  function addRuleHook(rule) {
    if (rule.type === 'style' && isRawSelector(rule.name)) {
      rule.name = rule.name.replace(/^@raw\s?/, '');
      rule.selectorText = rule.name;
    }
  }

  return { addRuleHook };
}

export function isRawSelector(ruleName) {
  return ruleName.substr(0, 4) === '@raw';
}

