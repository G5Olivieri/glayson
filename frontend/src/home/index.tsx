import { useAuth } from "@app/login/use-auth"
import { t } from "i18next"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import style from './style.module.scss'

export const Header: React.FC = () => {
  const { t } = useTranslation()
  const auth = useAuth()

  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/bloguinho">Bloguinho</Link></li>
          <li><Link to="/financeiro">Financeiro</Link></li>
          <li><button onClick={() => auth.signout()}>{t('logout')}</button></li>
        </ul>
      </nav>
    </header>
  )
}

export const Home: React.FC = () => {
  const { t, i18n } = useTranslation()

  const onChangeLanguageClick = () => {
    const lang = i18n.language === 'en' ? 'ptBr' : 'en'
    i18n.changeLanguage(lang)
    localStorage.setItem('language', lang)
  }

  return (
    <div className={style.container}>
      <Header />
      <h1>Home</h1>
      <p>{t('language')}: {i18n.language}</p>
      <button onClick={onChangeLanguageClick} type="button">{t('change')}</button>
    </div>
  )
}
