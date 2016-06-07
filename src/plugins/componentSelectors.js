import kebabCase from 'lodash/kebabCase';

export default function componentSelectors() {
  function addRuleHook(rule, sheetInterface) {
    const { styleSheet, theme, ruleDefinition } = sheetInterface;

    if (rule.type === 'style') {
      let className = `${styleSheet.prefix}__${kebabCase(rule.name)}`;

      if (theme && theme.id) {
        className = `${className}--${theme.id}`;
      }

      if (ruleDefinition && ruleDefinition.expose) {
        rule.className = className;
      }

      rule.selectorText = `.${className}`;
    }
  }

  return { addRuleHook };
}
