import i18next from 'i18next';
import enJson from './locales/en.json';
import esJson from './locales/es.json';
import { initReactI18next, useTranslation } from 'react-i18next';
import { AsyncStorage } from 'react-native';

export const STORAGE_KEY = '@APP:languageCode';

export function translateCell(cell:string) {
  return (i18next.t(cell));
}

export function getCurrentLang() {
  return i18next.language;
}

export async function changeLang(lang:string) {
  try {
    await i18next.changeLanguage(lang);
    await AsyncStorage.setItem(STORAGE_KEY, lang);
  } catch (error) {
    console.log(` changeLanguage() Error : ${error}`);
  }
}

export const resources = {
  en: {
    enJson,
  },
  es: {
    esJson,
  },
} as const;

i18next
    .use(initReactI18next)
    .init({
      lng: 'en',
        // tslint:disable-next-line:object-shorthand-properties-first
      resources: {
        en: {
          translation: {
            key: 'hello world',
          },
        },
      },
      debug: true,
      backend: { loadPath: `${process.env.PUBLIC_URL}/locales/{{lng}}/{{ns}}.json` },
        // tslint:disable-next-line:ter-arrow-parens
    }).then(r => {});
