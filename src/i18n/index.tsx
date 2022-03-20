import i18next from 'i18next';
import enJson from './locales/en.json';
import esJson from './locales/es.json';
import { initReactI18next } from 'react-i18next';
import realmDb from "../db/RealmConfig";

export const STORAGE_KEY = '@APP:languageCode';

export const LANGUAGES_LIST = ['English','Spanish', 'French']

export const LANGUAGES_KEYS = {
    EN: 'en',
    ES: 'es'
}
export const LANGUAGES_NAMES = {
    'English': 'en',
    'Spanish': 'es',
    'French': 'fr',
}

export const getRoute = (route:string) => {
    const defaultJson:Json = enJson;

    // @ts-ignore
    return defaultJson.routes[route];
}

export const getCurrentLanguage= async ():Promise<string> => {
    return await realmDb.getLanguage();
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
    realmDb.getLanguage().then(lang => {
        i18next
            .use(initReactI18next)
            .init({
                lng: 'en',
                // tslint:disable-next-line:object-shorthand-properties-first
                resources,
                debug: true,
                // tslint:disable-next-line:ter-arrow-parens
            });

    });
}

initi18n();
