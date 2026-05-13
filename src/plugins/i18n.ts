import { createI18n } from 'vue-i18n';
import frFR from '../locales/fr-FR.json';

type MessageSchema = typeof frFR;

interface TranslationKey {
    [k: string]: string;
  }
  
  interface TranlationStructure {
    [k: string]: TranlationStructure | string;
  }
  

const toObject = (arr: TranslationKey[], key: string, labelKey: string) => {
    const result: TranlationStructure = {};
    (arr || []).forEach(val => {
      const label = (val[labelKey] || '');
      const keys = (val[key] || '').split('.');
      let searchingIn = result;
      keys.slice(0, -1)
        .forEach(k => {
          if (!searchingIn[k]) {
            searchingIn[k] = {};
          }
          searchingIn = searchingIn[k] as TranlationStructure;
        });
      searchingIn[keys[keys.length - 1]] = label;
    });
    return result as any;
  };
  

function loadFrenchLocaleMessages(): typeof frFR  {
    const locales = require.context('../locales', true, /[-FRfr_,\s]+\.json$/i);
    let messages: typeof frFR = [];
    locales.keys()
      .forEach(key => {
        const matched = key.match(/([A-Za-z0-9-_]+)\./i);
        if (matched && matched.length > 1) {
          messages = toObject(locales(key), 'nom', 'libelle');
        }
      });
    return messages;
  }
  

const i18n =  createI18n<[MessageSchema], 'fr-FR'>({
    locale: 'fr-FR',
    messages: {
        'fr-FR': loadFrenchLocaleMessages()
    },
});

export default i18n;
