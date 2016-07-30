import prefixAll from 'inline-style-prefixer/static';

export default function vendorPrefixer(prefix = prefixAll) {
  function addRuleHook(rule) {
    if (rule.type === 'style') {
      rule.declaration = prefix(rule.declaration);
    }
  }

  function inlineStyleHook(declaration) {
    return prefix(declaration);
  }

  return { addRuleHook, inlineStyleHook };
}
