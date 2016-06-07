import { createVirtualRenderer } from './virtualRenderer';
import canUseDOM from '../utils/canUseDOM';
import { rulesToCSS } from '../utils/css';

export function createDOMRenderer({
  domDocument = canUseDOM && window.document,
  element = getStylishlyDOMElement(domDocument)
} = {}) {
  const renderer = createVirtualRenderer();

  renderer.events.on('renderSheet', (id, rules) => {
    element.textContent = element.textContent + rulesToCSS(rules);
  });

  return renderer;
}

export function getStylishlyDOMElement(domDocument) {
  // first see if we have a node the user placed
  let stylishlyDOMElement = domDocument.head.querySelector('[data-stylishly]');

  if (stylishlyDOMElement === null) {
    stylishlyDOMElement = createStylishlyDOMElement(domDocument);
  }

  return stylishlyDOMElement;
}

export function createStylishlyDOMElement(domDocument) {
  const styleNode = domDocument.createElement('style');
  styleNode.setAttribute('data-stylishly', true);

  domDocument.head.appendChild(styleNode);

  return styleNode;
}
