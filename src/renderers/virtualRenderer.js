import ee from 'event-emitter';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';

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

  function renderSheet(id, rules) {
    const existing = getSheet(id);

    // Mainly for HMR support right now... but can we optimize?
    if (existing) {
      const oldRules = existing.rules;
      existing.rules = rules;
      emitter.emit('updateSheet', id, rules, oldRules);
    } else {
      sheets.push({ id, rules });
      emitter.emit('renderSheet', id, rules);
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
