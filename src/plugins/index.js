import { createPluginRegistry } from './registry';
import camelCase from './camelCase';
import vendorPrefixer from './vendorPrefixer';
import pseudoClasses from './pseudoClasses';
import componentSelectors from './componentSelectors';
import rawSelectors from './rawSelectors';
import descendants from './descendants';
import units from './units';

export {
  createPluginRegistry,
  camelCase,
  vendorPrefixer,
  pseudoClasses,
  componentSelectors,
  rawSelectors,
  descendants,
  units
};

export function createDefaultPlugins() {
  return [
    rawSelectors(),
    componentSelectors(),
    descendants(),
    pseudoClasses(),
    units(),
    camelCase(),
    vendorPrefixer()
  ];
}
