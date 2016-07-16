import Prefixer from 'inline-style-prefixer';
import canUseDOM from 'stylishly/lib/utils/canUseDOM';

export default function vendorPrefixer({
  prefixer = new Prefixer({
    userAgent: canUseDOM ? undefined : 'all',
  }),
} = {}) {
  function addRuleHook(rule) {
    if (rule.type === 'style') {
      rule.declaration = prefixer.prefix(rule.declaration);
    }
  }

  return { addRuleHook };
}
