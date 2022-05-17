import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    lng: "en",
    resources: {
      ptBr: {
        translation: {
          create: 'criar',
          name: 'nome',
          date: 'data',
          new: 'novo',
          update: 'atualizar',
          delete: 'deletar',
          change: 'mudar',
          logout: 'sair',
          pay: 'pagar',
          paid: 'pago',
          'new transaction': 'nova transação',
          'update transaction': 'atualizar transação',
          language: 'idioma',
          submit: 'enviar',
        }
      }
    },
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

const lang = localStorage.getItem('language')
if (lang) {
  i18n.changeLanguage(lang)
} else {
  localStorage.setItem('language', 'en')
}

export default i18n;
