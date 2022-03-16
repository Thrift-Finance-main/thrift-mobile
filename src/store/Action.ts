import {ISBLACKTHEME} from './ActionTypes';

export const setTheme = (isBlackTheme: any) => {
  return {
    type: ISBLACKTHEME,
    isBlackTheme,
  };
};
