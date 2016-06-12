
export function kebabCase(string) {
  return string.split(/ |_|-/).join('-').split('').map((a, i) => {
    if (a.toUpperCase() === a && a !== '-') {
      return (i !== 0 ? '-' : '') + a.toLowerCase();
    }
    return a;
  }).join('').toLowerCase();
}

export function transform(obj, cb, accumulator) {
  Object.keys(obj).forEach((key) => {
    cb(accumulator, obj[key], key);
  });
  return accumulator;
}

export function find(arr, pred) {
  const index = findIndex(arr, pred);
  return index > -1 ? arr[index] : undefined;
}

export function findIndex(arr, pred) {
  for (let i = 0; i < arr.length; i++) {
    if (typeof pred === 'function' && pred(arr[i], i, arr) === true) {
      return i;
    }
    if (typeof pred === 'object' && contains(arr[i], pred)) {
      return i;
    }
  }
  return -1;
}

export function contains(obj, pred) {
  for (const key in pred) {
    if (!obj.hasOwnProperty(key) || obj[key] !== pred[key]) {
      return false;
    }
  }
  return true;
}
