const pseudoRegexp = /^([a-z0-9_-]+):[a-z0-9_-]+$/i;
const pseudoSuffixRegexp = /:[a-z0-9_-]+$/i;

export default function pseudoClasses() {
  function resolveSelectorHook(selectorText, name, rule) {
    if (rule.type === 'style') {
      const matches = name.match(pseudoRegexp);
      if (matches !== null) {
        if (rule.classNames) {
          Object.keys(rule.classNames).forEach((n) => {
            const obj = rule.classNames[n];
            obj.name = obj.name.replace(pseudoSuffixRegexp, '');
            obj.className = obj.className.replace(pseudoSuffixRegexp, '');
          });
        } else if (rule.className) {
          rule.name = matches[1];
          rule.className = rule.className.replace(pseudoSuffixRegexp, '');
        }
      }
    }

    return selectorText;
  }

  return { resolveSelectorHook };
}
