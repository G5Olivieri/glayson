import { useAuth } from "@app/login/use-auth"
import { Link } from "react-router-dom"
import style from './style.module.scss'

export const Header: React.FC = () => {
  const auth = useAuth()

  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/bloguinho">Bloguinho</Link></li>
          <li><Link to="/financeiro">Financeiro</Link></li>
          <li><button onClick={() => auth.signout()}>logout</button></li>
        </ul>
      </nav>
    </header>
  )
}

export const Home: React.FC = () => {
  return (
    <div className={style.container}>
      <Header />
      <h1>Home</h1>
    </div>
  )
}
