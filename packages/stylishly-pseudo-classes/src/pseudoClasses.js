const pseudoRegexp = /^([a-z0-9_-]+):[a-z0-9_-]+$/i;
const pseudoSuffixRegexp = /:[a-z0-9_-]+$/i;

export default function pseudoClasses() {
  function resolveSelectorHook(selectorText, name, rule) {
    if (rule.type === 'style') {
      const matches = name.match(pseudoRegexp);
      if (matches !== null) {
        if (rule.classNames) {
          Object.keys(rule.classNames).forEach((n) => removePseudoSyntax(rule.classNames[n]));
        } else if (rule.className) {
          removePseudoSyntax(rule);
        }
      }
    }

    return selectorText;
  }

  return { resolveSelectorHook };
}

function removePseudoSyntax(obj) {
  obj.name = obj.name.replace(pseudoSuffixRegexp, '');
  obj.className = obj.className.replace(pseudoSuffixRegexp, '');
}
