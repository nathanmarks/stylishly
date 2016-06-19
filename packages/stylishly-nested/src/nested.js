
export default function nested() {
  function transformDeclarationHook(key, value, rule, sheetInterface) {
    const { addRule, ruleDefinition } = sheetInterface;

    if (isNested(value)) {
      delete rule.declaration[key];

      addRule({
        ...ruleDefinition,
        name: key,
        declaration: value,
        nested: true,
        parent: rule
      });

      return false;
    }

    return true;
  }

  return { transformDeclarationHook };
}

function isNested(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}
