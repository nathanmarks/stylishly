import ee from 'event-emitter';
import { find, findIndex } from 'stylishly-utils/lib/helpers';

export function createVirtualRenderer() {
  const sheets = [];
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

    // Mainly for HMR support right now... but can we optimize?
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
      sheets.splice(sheetIndex, 1);
    }
    emitter.emit('removeSheet', id);
  }

  return {
    events: emitter,
    getSheet,
    getSheets,
    renderSheet,
    removeSheet
  };
}
