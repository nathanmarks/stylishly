const pseudoRegexp = /^&\s?:/;
const replaceRegex = /^&\s?/;

export default function pseudoClasses() {
  function resolveSelectorHook(selectorText, name, rule) {
    if (rule.type === 'style' && isPseudoClass(name)) {
      return name.replace(replaceRegex, '');
    }
    return selectorText;
  }

  return { resolveSelectorHook };
}

export function isPseudoClass(key) {
  return pseudoRegexp.test(key);
}
