import ee from 'event-emitter';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';

export function createVirtualRenderer() {
  const sheets = [];
  const emitter = ee();

  function getSheet(id) {
    return find(sheets, { id });
  }

  function getSheets() {
    return sheets;
  }

  function renderSheet(id, rules) {
    sheets.push({ id, rules });
    emitter.emit('renderSheet', id, rules);
  }

  function removeSheet(id) {
    const sheetIndex = findIndex(sheets, { id });
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
