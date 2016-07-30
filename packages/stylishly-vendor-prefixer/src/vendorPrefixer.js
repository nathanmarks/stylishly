
export default function vendorPrefixer(prefix) {
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
