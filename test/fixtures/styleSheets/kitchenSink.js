import { createStyleSheet } from 'packages/stylishly/src/styleSheet';
import { createPluginRegistry } from 'packages/stylishly/src/pluginRegistry';
import vendorPrefixer from 'packages/stylishly-vendor-prefixer/src/vendorPrefixer';
import pseudoClasses from 'packages/stylishly-pseudo-classes/src/pseudoClasses';
import descendants from 'packages/stylishly-descendants/src/descendants';
import units from 'packages/stylishly-units/src/units';

export function createKitchenSinkSheet() {
  const pluginRegistry = createPluginRegistry();

  pluginRegistry.registerPlugins(
    descendants(),
    pseudoClasses(),
    units(),
    vendorPrefixer()
  );

  const styleSheet = createStyleSheet('KitchenSink', () => {
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
      }
    };
  });

  const rules = styleSheet.resolveStyles({}, pluginRegistry);

  return { styleSheet, rules };
}
