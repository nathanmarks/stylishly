import { createVirtualRenderer } from './virtualRenderer';
import canUseDOM from '../utils/canUseDOM';
import { rulesToCSS } from '../utils/css';
import asap from 'asap/raw';

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
    default: getStylishlyDOMElement(domDocument, 'default'),
  },
} = {}) {
  // if an element is passed instead
  // of an object, set it to the default group
  if (element && !element.hasOwnProperty('default')) {
    element = { default: element };
  }

  /**
   * If true, the stylesheet writes are currently buffering
   *
   * @type {Boolean}
   */
  let isBuffering = false;

  /**
   * Holds buffer content for each group
   *
   * @type {Object}
   */
  const bufferContent = { default: '' };

  /**
   * The event emitting virtual renderer
   *
   * @type {Object}
   */
  const renderer = createVirtualRenderer();

  /**
   * Requests an ASAP flush
   *
   * @type {Function}
   */
  renderer.requestFlush = asap.requestFlush;

  renderer.events.on('renderSheet', (id, rules, options) => {
    buffer((css) => {
      const ruleString = rulesToCSS(rules);
      if (css.indexOf(ruleString) === -1) {
        return css + ruleString;
      }
      return css;
    }, options);
  });

  renderer.events.on('removeSheet', (id, rules, options) => {
    buffer((css) => css.replace(rulesToCSS(rules), ''), options);
  });

  renderer.events.on('removeAll', () => {
    Object.keys(element).forEach((group) => {
      buffer(() => '', { group });
    });
  });

  // just for HMR right now
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
    if (element[group].textContent !== bufferContent[group]) {
      element[group].textContent = bufferContent[group];
    }
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
