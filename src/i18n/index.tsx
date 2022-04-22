import i18next from 'i18next';
import enJson from './locales/en.json';
import esJson from './locales/es.json';
import { initReactI18next } from 'react-i18next';

export const LANGUAGES_LIST = ['English','Spanish']

export const LANGUAGE_DICT = {
    "English": "en",
    "Spanish": "es",
}

export const LANGUAGES_KEYS = {
    EN: 'en',
    ES: 'es'
}
export const LANGUAGES_MODAL =  [
    {
        title: "English"
    },
    {
        title: "Spanish"
    }
]
export const LANGUAGES_NAMES = {
    'English': 'en',
    'Spanish': 'es'
}
export const LANGUAGES_NAMES_INVERT = {
    'en': 'English',
    'es': 'Spanish'
}

export const getRoute = (route:string) => {
    const defaultJson:Json = enJson;

    // @ts-ignore
    return defaultJson.routes[route];
}

// @ts-ignore
export const getCurrentLanguage= async ():Promise<string> => {
    //return await realmDb.getLanguage();
}

export function translate(cell:string) {
  return (i18next.t(cell));
}

export function getCurrentLang() {
    return i18next.language;
}

export async function changeLang(lang:string) {
  i18next.changeLanguage(lang);
}

export const resources = {
  en: {
    translation: enJson,
  },
  es: {
    translation: esJson,
  },
} as const;

export function initi18n() {
    i18next
        .use(initReactI18next)
        .init({
            lng: 'en',
            // tslint:disable-next-line:object-shorthand-properties-first
            resources,
            debug: true,
            // tslint:disable-next-line:ter-arrow-parens
        });
}

initi18n();
