const pseudoRegexp = /^([a-z0-9_-]+)?(:[a-z0-9_-]+)$/i;

export default function pseudoClasses() {
  function parseRuleHook(rule) {
    const matches = rule.name.match(pseudoRegexp);
    if (matches !== null) {
      rule.name = matches[1];
      rule.pseudoClass = matches[2];
    }
  }

  function resolveSelectorHook(selectorText, name, rule) {
    if (rule.pseudoClass) {
      return selectorText + rule.pseudoClass;
    }

    return selectorText;
  }

  return { parseRuleHook, resolveSelectorHook };
}
