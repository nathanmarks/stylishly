import { createVirtualRenderer } from './virtualRenderer';
import { createDOMRenderer } from './domRenderer';
import canUseDOM from 'stylishly-utils/lib/canUseDOM';

/**
 * @module renderers
 */

/**
 * Fetch the renderer (virtual or DOM depending on environment)
 *
 * @param  {boolean}  [dom=canUseDOM] - Is the DOM available. Defaults to automatic detection.
 * @param  {Object}   [options]       - Options to pass to the renderer factory method
 * @return {Object}                   - The renderer object
 */
export function getRenderer(dom = canUseDOM, options) {
  if (dom) {
    return createDOMRenderer(options);
  } else {
    return createVirtualRenderer(options);
  }
}
