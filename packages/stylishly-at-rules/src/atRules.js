
const atRuleList = ['media', 'keyframes'];

export default function atRules() {
  function parseRuleHook(rule, sheetInterface) {
    const { ruleDefinition } = sheetInterface;

    if (isMediaQuery(rule.name)) {
      rule.type = 'media';
      rule.mediaText = rule.name;
    } else if (isKeyframes(rule.name)) {
      rule.type = 'keyframes';
      rule.keyframesText = rule.name;
    }

    for (let i = 0; i < atRuleList.length; i++) {
      const parent = getClosestParent(atRuleList[i], ruleDefinition);
      if (parent) {
        rule.parent = parent;
        if (rule.parent.type === 'keyframes') {
          ruleDefinition.expose = false; // keyframe children don't have selectors
        }
        break;
      }
    }
  }

  function resolveSelectorHook(selectorText, name, rule, sheetInterface) {
    const { ruleDefinition } = sheetInterface;
    if (ruleDefinition.parent && ruleDefinition.parent.type === 'keyframes') {
      return name;
    }
    return selectorText;
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
        parent: rule,
      });
      delete rule.declaration;
    }
  }

  return { resolveSelectorHook, parseRuleHook, addRuleHook };
}

export function getClosestParent(parentType, rule) {
  if (rule.parent) {
    if (rule.parent.type === parentType) {
      return rule.parent;
    }
    return getClosestParent(parentType, rule.parent);
  }
  return false;
}

export function isMediaQuery(ruleName) {
  return ruleName.substr(0, 6) === '@media';
}

export function isKeyframes(ruleName) {
  return ruleName.substr(0, 10) === '@keyframes';
}
