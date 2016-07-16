const pseudoRegexp = /^([a-z0-9_-]+):[a-z0-9_-]+$/i;

export default function pseudoClasses() {
  function resolveSelectorHook(selectorText, name, rule) {
    if (rule.type === 'style') {
      const matches = name.match(pseudoRegexp);
      if (matches !== null) {
        if (rule.className) {
          rule.name = matches[1];
          rule.className = rule.className.replace(/:[a-z0-9_-]+$/i, '');
        } else if (rule.classNames) {
          Object.keys(rule.classNames).forEach((n) => {
            n.name = matches[1];
            n.className = n.className.replace(/:[a-z0-9_-]+$/i, '');
          });
        }
      }
    }

    return selectorText;
  }

  return { resolveSelectorHook };
}
