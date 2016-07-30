import prefixAll from 'inline-style-prefixer/static';
import plugin from './vendorPrefixer';

export default function vendorPrefixer(prefix = prefixAll) {
  return plugin(prefix);
}
