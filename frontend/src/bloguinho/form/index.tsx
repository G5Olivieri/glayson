import { useState } from "react"
import { useTranslation } from "react-i18next"
import style from './style.module.scss'

type PostFormProps = {
  onNewPost(text: string): void
}

export const PostForm: React.FC<PostFormProps> = ({ onNewPost }) => {
  const { t } = useTranslation()
  const [text, setText] = useState('')

  return (
    <form
      className={style.container}
      onSubmit={(event) => { event.preventDefault(); onNewPost(text); setText('') }}
    >
      <textarea autoFocus onChange={(event) => setText(event.target.value)} value={text}></textarea>
      <button>{t('submit')}</button>
    </form>
  )
}
