import i18next from 'i18next';
import enJson from './locales/en.json';
import esJson from './locales/es.json';
import { initReactI18next } from 'react-i18next';

export const STORAGE_KEY = '@APP:languageCode';

export const getRoute = (route:string) => {
    const defaultJson:Json = enJson;

    // @ts-ignore
    return defaultJson.routes[route];
}

export function translate(cell:string) {
  return (i18next.t(cell));
}

export function getCurrentLang() {
  return i18next.language;
}

export async function changeLang(lang:string) {
  i18next.changeLanguage(lang);
  /*
  try {
    await AsyncStorage.setItem(STORAGE_KEY, lang);
  } catch (error) {
    console.log(` changeLanguage() Error : ${error}`);
  }
  */
}

export const resources = {
  en: {
    translation: enJson,
  },
  es: {
    translation: esJson,
  },
} as const;

i18next
    .use(initReactI18next)
    .init({
      lng: 'en',
        // tslint:disable-next-line:object-shorthand-properties-first
      resources,
      debug: true,
        // tslint:disable-next-line:ter-arrow-parens
    });
