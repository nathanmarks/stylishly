import ee from 'event-emitter';
import { find, findIndex } from '../utils/helpers';
import { rulesToCSS } from '../utils/css';

export function createVirtualRenderer() {
  let sheets = [];
  const emitter = ee();

  function getSheet(id) {
    return find(sheets, { id });
  }

  function getSheetIndex(id) {
    return findIndex(sheets, { id });
  }

  function getSheets() {
    return sheets;
  }

  function renderSheet(id, rules, options = {}) {
    const existing = getSheet(id);

    if (existing) {
      const oldRules = existing.rules;
      existing.rules = rules;
      emitter.emit('updateSheet', id, rules, oldRules, options);
    } else {
      sheets.push({ id, rules, options });
      emitter.emit('renderSheet', id, rules, options);
    }

    return id;
  }

  /**
   * Returns an object containing the current sheets in the renderer,
   * keyed by grouping (default is `default`) with a CSS string as the value
   */
  function renderSheetsToCSS() {
    return getSheets().reduce((result, n) => {
      if (n.options && n.options.group) {
        if (!result[n.options.group]) {
          result[n.options.group] = '';
        }
        result[n.options.group] += rulesToCSS(n.rules);
      } else {
        result.default += rulesToCSS(n.rules);
      }
      return result;
    }, { default: '' });
  }

  function removeSheet(id, sheetIndex = getSheetIndex(id)) {
    if (sheetIndex !== -1) {
      sheets.splice(sheetIndex, 1);
      emitter.emit('removeSheet', id, sheets[sheetIndex].rules);
    }
  }

  function removeAll() {
    sheets = [];
    emitter.emit('removeAll');
  }

  return {
    events: emitter,
    getSheet,
    getSheets,
    renderSheet,
    renderSheetsToCSS,
    removeSheet,
    removeAll,
  };
}
