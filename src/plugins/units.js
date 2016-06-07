import isUnitlessCSSProperty from 'unitless-css-property';

export default function units(unit = 'px') {
  function transformDeclarationHook(key, value, rule) {
    if (!isUnitlessCSSProperty(key)) {
      if (Array.isArray(value)) {
        rule.declaration[key] = value.map((val) => addUnitIfNeeded(key, val, unit));
      } else {
        rule.declaration[key] = addUnitIfNeeded(key, value, unit);
      }
    }
  }

  return { transformDeclarationHook };
}

function addUnitIfNeeded(property, value, unit) {
  const valueType = typeof value;
  if (valueType === 'number' || valueType === 'string' && value == parseFloat(value)) { // eslint-disable-line
    value = value + unit;
  }

  return value;
}
