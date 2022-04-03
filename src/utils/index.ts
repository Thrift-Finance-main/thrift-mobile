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

