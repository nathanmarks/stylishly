import { createStyleSheet } from 'packages/stylishly/src/styleSheet';
import { createPluginRegistry } from 'packages/stylishly/src/pluginRegistry';
import vendorPrefixer from 'packages/stylishly-vendor-prefixer/src/vendorPrefixer';
import pseudoClasses from 'packages/stylishly-pseudo-classes/src/pseudoClasses';
import descendants from 'packages/stylishly-descendants/src/descendants';
import units from 'packages/stylishly-units/src/units';
import chained from 'packages/stylishly-chained/src/chained';
import mediaQueries from 'packages/stylishly-media-queries/src/mediaQueries';
import nested from 'packages/stylishly-nested/src/nested';

export function createKitchenSinkSheet() {
  const pluginRegistry = createPluginRegistry();

  pluginRegistry.registerPlugins(
    nested(),
    mediaQueries(),
    descendants(),
    pseudoClasses(),
    chained(),
    units(),
    vendorPrefixer()
  );

  const styleSheet = createStyleSheet('Foo', () => {
    return {
      base: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
      },
      button: {
        'base &': {
          color: 'red',
          minWidth: 64,
          '& :hover': {
            color: 'blue'
          },
          '& primary': {
            color: 'purple'
          }
        }
      },
      titanic: {
        float: 'none'
      },
      '@media (min-width: 800px)': {
        titanic: {
          float: 'left'
        },
        button: {
          'base &': {
            minWidth: 'none'
          }
        }
      },
      container: {
        width: 20,
        '@media (min-width: 500px)': {
          width: 100
        }
      },
      '@media (max-width: 1024px)': {
        hoisted: {
          color: 'green'
        }
      }
    };
  });

  const rules = styleSheet.resolveStyles({}, pluginRegistry);

  return { styleSheet, rules };
}

export function createSimple() {
  const pluginRegistry = createPluginRegistry();

  pluginRegistry.registerPlugins(
    nested(),
    mediaQueries(),
    descendants(),
    pseudoClasses(),
    chained(),
    units(),
    vendorPrefixer()
  );

  const styleSheet = createStyleSheet('Foo', () => {
    return {
      button: {
        color: 'red',
        '&primary': {
          color: 'purple'
        }
      }
    };
  });

  const rules = styleSheet.resolveStyles({}, pluginRegistry);

  return { styleSheet, rules };
}
