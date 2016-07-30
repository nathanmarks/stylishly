import Prefixer from 'inline-style-prefixer';
import plugin from './vendorPrefixer';

export default function vendorPrefixer(prefixer = new Prefixer()) {
  return plugin(prefixer.prefix.bind(prefixer));
}
