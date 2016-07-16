import { find } from 'stylishly/lib/utils/helpers';

const chainedRegexp = /^&\s?(.+)/;
const parentRegexp = /^([a-z0-9_-]+)\s?&/i;

export default function nested() {
  function parseRuleHook(rule, sheetInterface) {
    const { ruleDefinition } = sheetInterface;
    if (ruleDefinition.nested) {
      const chainedMatches = rule.name.match(chainedRegexp);
      if (chainedMatches !== null) {
        rule.name = chainedMatches[1];
        rule.chained = true;
        return;
      }

      const parentMatches = rule.name.match(parentRegexp);
      if (parentMatches !== null) {
        rule.name = parentMatches[1];
        rule.nestedParent = true;
        return;
      }

      rule.nestedChild = true;
    }
  }

  function resolveSelectorHook(selectorText, name, rule, sheetInterface) {
    const { rules, ruleDefinition } = sheetInterface;
    if (ruleDefinition.nested) {
      const ancestor = find(rules, ruleDefinition.parent);
      if (ancestor.type === 'style') {
        if (rule.chained) {
          return `${ancestor.selectorText}${selectorText}`;
        } else if (rule.nestedParent) {
          return `${selectorText} ${ancestor.selectorText}`;
        } else if (rule.nestedChild) {
          return `${ancestor.selectorText} ${selectorText}`;
        }
      }
    }
    return selectorText;
  }

  function transformDeclarationHook(key, value, rule, sheetInterface) {
    const { addRule, ruleDefinition } = sheetInterface;

    if (isNested(value)) {
      delete rule.declaration[key];
      addRule({
        ...ruleDefinition,
        name: key,
        declaration: value,
        nested: true,
        parent: rule,
      });

      return false;
    }

    return true;
  }

  return { parseRuleHook, resolveSelectorHook, transformDeclarationHook };
}

function isNested(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}
