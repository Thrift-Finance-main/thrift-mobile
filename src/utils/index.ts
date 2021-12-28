// eslint-disable-next-line import/prefer-default-export
export const addressSlice = (address: string, sliceLength: number = 10) => {
  if (address) {
    return `${address.slice(0, sliceLength)}...${address.slice(-sliceLength)}`;
  }
  return address;
};
