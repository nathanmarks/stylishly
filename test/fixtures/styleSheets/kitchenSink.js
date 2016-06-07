import { createStyleSheet } from 'src/styleSheet';
import { createPluginRegistry } from 'src/plugins/registry';
import camelCase from 'src/plugins/camelCase';
import vendorPrefixer from 'src/plugins/vendorPrefixer';
import pseudoClasses from 'src/plugins/pseudoClasses';
import componentSelectors from 'src/plugins/componentSelectors';
import descendants from 'src/plugins/descendants';
import units from 'src/plugins/units';

export function createKitchenSinkSheet() {
  const pluginRegistry = createPluginRegistry();

  pluginRegistry.registerPlugins(
    componentSelectors(),
    descendants(),
    pseudoClasses(),
    units(),
    camelCase(),
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
