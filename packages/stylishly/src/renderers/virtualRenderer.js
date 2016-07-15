import ee from 'event-emitter';
import { find, findIndex } from 'stylishly-utils/lib/helpers';

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

  function removeSheet(id, sheetIndex = getSheetIndex(id)) {
    if (sheetIndex !== -1) {
      emitter.emit('removeSheet', id, sheets[sheetIndex].rules);
      sheets.splice(sheetIndex, 1);
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
    removeSheet,
    removeAll,
  };
}
