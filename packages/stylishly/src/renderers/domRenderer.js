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
 * @param  {Node}         options.element     - pass an existing element or elements keyed by group
 *                                              in an object to use for stylishly
 * @return {Object}                           - the renderer
 */
export function createDOMRenderer({
  domDocument = canUseDOM && window.document,
  element = {
    default: getStylishlyDOMElement(domDocument, 'default')
  }
} = {}) {
  const renderer = createVirtualRenderer();

  if (element && !element.hasOwnProperty('default')) {
    element = { default: element };
  }

  let isBuffering = false;
  const bufferContent = { default: '' };

  renderer.events.on('renderSheet', (id, rules, options) => {
    buffer((css) => css + rulesToCSS(rules), options);
  });

  // We can do better than this, just for HMR right now
  renderer.events.on('updateSheet', (id, rules, oldRules, options) => {
    buffer((css) => css.replace(rulesToCSS(oldRules), rulesToCSS(rules)), options);
  });

  function buffer(cb, options = {}) {
    const { group = 'default' } = options;

    if (!bufferContent.hasOwnProperty(group)) {
      bufferContent[group] = '';
    }

    if (!element.hasOwnProperty(group)) {
      element[group] = getStylishlyDOMElement(domDocument, group);
    }

    if (!isBuffering) {
      isBuffering = true;
      Object.keys(bufferContent).forEach((n) => bufferContent[n] = element[n].textContent);
      asap(flushBuffers);
    }

    bufferContent[group] = cb(bufferContent[group]);
  }

  function flushBuffers() {
    Object.keys(bufferContent).forEach((n) => flushBuffer(n));
    isBuffering = false;
  }

  function flushBuffer(group) {
    element[group].textContent = bufferContent[group];
    bufferContent[group] = '';
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
export function getStylishlyDOMElement(domDocument, group) {
  // first see if we have a node the user placed
  let stylishlyDOMElement = domDocument.head.querySelector(`[data-stylishly='${group}']`);

  if (stylishlyDOMElement === null) {
    stylishlyDOMElement = createStylishlyDOMElement(domDocument, group);
  }

  return stylishlyDOMElement;
}

/**
 * Create the stylishly DOM node in the document
 *
 * @param  {HTMLDocument} domDocument - usually from window
 * @return {Node}
 */
export function createStylishlyDOMElement(domDocument, group) {
  const styleNode = domDocument.createElement('style');
  styleNode.setAttribute('data-stylishly', group);

  domDocument.head.appendChild(styleNode);

  return styleNode;
}
