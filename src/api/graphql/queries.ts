import axios from 'axios';

// eslint-disable-next-line import/prefer-default-export
export const startQuery = async (query: any, params: any, url: string) => {
  try {
    return await axios.post(url, {
      query,
      variables: params,
    });
  } catch (e) {
    console.log(e);
    return [e];
  }
};
