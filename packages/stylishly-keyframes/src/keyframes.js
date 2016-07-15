
export default function keyframes() {
  function resolveSelectorHook(selectorText, name, rule, sheetInterface) {
    const { ruleDefinition } = sheetInterface;
    if (ruleDefinition.parent && ruleDefinition.parent.type === 'keyframes') {
      return name;
    }
    return selectorText;
  }

  function parseRuleHook(rule, sheetInterface) {
    const { ruleDefinition } = sheetInterface;

    if (isKeyframes(rule.name)) {
      rule.type = 'keyframes';
      rule.keyframesText = rule.name;
    }

    const keyframesParent = getClosestKeyframes(ruleDefinition);

    if (keyframesParent) {
      rule.parent = keyframesParent;
      ruleDefinition.expose = false;
    }
  }

  function addRuleHook(rule, sheetInterface) {
    const { addRule, ruleDefinition } = sheetInterface;

    if (
      rule.type === 'keyframes' &&
      ruleDefinition.nested &&
      ruleDefinition.parent.type === 'style'
    ) {
      addRule({
        ...ruleDefinition,
        name: ruleDefinition.parent.name,
        declaration: rule.declaration,
        parent: rule,
        expose: false,
      });
      delete rule.declaration;
    }
  }

  return { parseRuleHook, addRuleHook, resolveSelectorHook };
}

export function getClosestKeyframes(rule) {
  if (rule.parent) {
    if (rule.parent.type === 'keyframes') {
      return rule.parent;
    }
    return getClosestKeyframes(rule.parent);
  }
  return false;
}

export function isKeyframes(ruleName) {
  return ruleName.substr(0, 10) === '@keyframes';
}
