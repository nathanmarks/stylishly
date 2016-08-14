import { createStyleSheet } from 'packages/stylishly/src/styleSheet';
import { createPluginRegistry } from 'packages/stylishly/src/pluginRegistry';
import vendorPrefixer from 'packages/stylishly-vendor-prefixer/src';
import pseudo from 'packages/stylishly-pseudo/src/pseudo';
import units from 'packages/stylishly-units/src/units';
import atRules from 'packages/stylishly-at-rules/src/atRules';
import nested from 'packages/stylishly-nested/src/nested';

export function createKitchenSinkSheet(theme = { id: 'a', color: 'red', hoverColor: 'blue' }) {
  const pluginRegistry = createPluginRegistry();

  pluginRegistry.registerPlugins(
    nested(),
    atRules(),
    pseudo(),
    units(),
    vendorPrefixer()
  );

  const styleSheet = createStyleSheet('Foo', ({ color = 'red', hoverColor = 'blue' } = {}) => {
    return {
      base: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
      },
      button: {
        'base &': {
          color: color,
          minWidth: 64,
          '& :hover': {
            color: hoverColor,
          },
          '& primary': {
            color: 'purple',
          },
        },
      },
      titanic: {
        float: 'none',
      },
      '@media (min-width: 800px)': {
        titanic: {
          float: 'left',
        },
        button: {
          'base &': {
            minWidth: 'none',
          },
        },
      },
      container: {
        width: 20,
        '@media (min-width: 500px)': {
          width: 100,
        },
      },
      '@media (max-width: 1024px)': {
        hoisted: {
          color: 'green',
        },
      },
    };
  });

  const rules = styleSheet.resolveStyles(theme, pluginRegistry);

  return { styleSheet, rules };
}

export function createSimple() {
  const pluginRegistry = createPluginRegistry();

  pluginRegistry.registerPlugins(
    nested(),
    atRules(),
    pseudo(),
    units(),
    vendorPrefixer()
  );

  const styleSheet = createStyleSheet('Foo', () => {
    return {
      button: {
        color: 'red',
        '&primary': {
          color: 'purple',
        },
      },
    };
  });

  const rules = styleSheet.resolveStyles({}, pluginRegistry);

  return { styleSheet, rules };
}
