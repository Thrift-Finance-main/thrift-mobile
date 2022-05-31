const cryptoImport = require('crypto');

export const sha256 = (input:string) => {
  return cryptoImport
      .createHash('sha256')
      .update(input)
      .digest('hex');
};

// eslint-disable-next-line import/prefer-default-export
export const addressSlice = (address: string, sliceLength: number = 10) => {
  if (address) {
    return `${address.slice(0, sliceLength)}...${address.slice(-sliceLength)}`;
  }
  return address;
};

export const shuffle = (array:any[]) => {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

export const getKeyByValue = (object, value) => {
  return Object.keys(object).find(key => object[key] === value);
}

export const delay = ms => new Promise(res => setTimeout(res, ms));

export const displayUnit = (quantity, decimals = 6) => {
  return parseInt(quantity) / 10 ** decimals;
};

export const isDictEmpty = (obj) => {
  return Object.keys(obj).length === 0;
}

export const groupBy2Props = (arr, prop1, prop2) => {
  return arr.reduce((map, obj) => {
    if (!map[obj[prop1]]) map[obj[prop1]] = {};
    [].concat(obj[prop2]).forEach(subEl => {
      if (!map[obj[prop1]][subEl]) map[obj[prop1]][subEl] = [];
      map[obj[prop1]][subEl].push(obj);
    });
    return map;
  }, {});
}

function groupBy(arr, prop) {
  const map = new Map(Array.from(arr, obj => [obj[prop], []]));
  arr.forEach(obj => map.get(obj[prop]).push(obj));
  return Array.from(map.values());
}

export function strFloat2int (value:string, decimals:number) {

  let r;
  if (value.includes('.')) {
    const num = value.split('.');
    const d = decimals-num[1];
    if (d >= 0){
      let zeros = '';
      for (let i = 0; i < d; i++) {
        zeros += '0';
      }
      r = num[1]+zeros;
    } else if (num[1].length > decimals){
      r = num[1].substr(0, decimals)
    }
    value = num[0]+r
  } else {
    let zeros = '';
    for (let i = 0; i < decimals; i++) {
      zeros += '0';
    }
    r = value + zeros;
    value = r
  }

  return value;
}
