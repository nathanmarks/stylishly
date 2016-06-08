import { createVirtualRenderer } from './virtualRenderer';
import { createDOMRenderer } from './domRenderer';
import canUseDOM from '../utils/canUseDOM';

/**
 * @module renderers
 */

/**
 * Fetch the renderer (virtual or DOM depending on environment)
 *
 * @param  {...<any>} [args] - Arguments to pass to the renderer factory method
 * @return {Object}          - The renderer object
 */
export function getRenderer(...args) {
  if (canUseDOM) {
    return createDOMRenderer(...args);
  } else {
    return createVirtualRenderer(...args);
  }
}
