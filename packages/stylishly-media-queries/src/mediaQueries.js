
export default function mediaQueries() {
  function parseRuleHook(rule, sheetInterface) {
    const { ruleDefinition } = sheetInterface;

    if (isMediaQuery(rule.name)) {
      rule.type = 'media';
      rule.mediaText = rule.name;
    }

    const mediaParent = getClosestMedia(ruleDefinition);

    if (mediaParent) {
      rule.parent = mediaParent;
    }
  }

  function addRuleHook(rule, sheetInterface) {
    const { addRule, ruleDefinition } = sheetInterface;

    if (
      rule.type === 'media' &&
      ruleDefinition.nested &&
      ruleDefinition.parent.type === 'style'
    ) {
      addRule({
        ...ruleDefinition,
        name: ruleDefinition.parent.name,
        declaration: rule.declaration,
        parent: rule
      });
      delete rule.declaration;
    }
  }

  return { parseRuleHook, addRuleHook };
}

export function getClosestMedia(rule) {
  if (rule.parent) {
    if (rule.parent.type === 'media') {
      return rule.parent;
    }
    return getClosestMedia(rule.parent);
  }
  return false;
}

export function isMediaQuery(ruleName) {
  return ruleName.substr(0, 6) === '@media';
}
