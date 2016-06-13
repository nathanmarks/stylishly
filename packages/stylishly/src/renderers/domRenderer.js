import { createVirtualRenderer } from './virtualRenderer';
import canUseDOM from 'stylishly-utils/lib/canUseDOM';
import { rulesToCSS } from 'stylishly-utils/lib/css';
import asap from 'asap';

/**
 * Create a DOM renderer to use for rendering styles
 * to an HTML document.
 *
 * @param  {Object}       options
 * @param  {HTMLDocument} options.domDocument - usually from window
 * @param  {Node}         options.element     - pass an existing element to use for stylishly
 * @return {Object}                           - the renderer
 */
export function createDOMRenderer({
  domDocument = canUseDOM && window.document,
  element = getStylishlyDOMElement(domDocument)
} = {}) {
  const renderer = createVirtualRenderer();

  let isBuffering = false;
  let bufferContent;

  renderer.events.on('renderSheet', (id, rules) => {
    buffer((css) => css + rulesToCSS(rules));
  });

  // We can do better than this, just for HMR right now
  renderer.events.on('updateSheet', (id, rules, oldRules) => {
    buffer((css) => css.replace(rulesToCSS(oldRules), rulesToCSS(rules)));
  });

  function buffer(cb) {
    if (!isBuffering) {
      isBuffering = true;
      bufferContent = element.textContent;
      asap(flushBuffer);
    }
    bufferContent = cb(bufferContent);
  }

  function flushBuffer() {
    element.textContent = bufferContent;
    bufferContent = undefined;
    isBuffering = false;
  }

  return renderer;
}

/**
 * Get the stylishly DOM node from the document
 *
 * @private
 * @param  {HTMLDocument} domDocument - usually from window
 * @return {Node}
 */
export function getStylishlyDOMElement(domDocument) {
  // first see if we have a node the user placed
  let stylishlyDOMElement = domDocument.head.querySelector('[data-stylishly]');

  if (stylishlyDOMElement === null) {
    stylishlyDOMElement = createStylishlyDOMElement(domDocument);
  }

  return stylishlyDOMElement;
}

/**
 * Create the stylishly DOM node in the document
 *
 * @param  {HTMLDocument} domDocument - usually from window
 * @return {Node}
 */
export function createStylishlyDOMElement(domDocument) {
  const styleNode = domDocument.createElement('style');
  styleNode.setAttribute('data-stylishly', true);

  domDocument.head.appendChild(styleNode);

  return styleNode;
}
