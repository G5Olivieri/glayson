import { PostResponse } from "@app/bloguinho/post-response"
import React from "react"
import style from './style.module.scss'
import { format, parseISO } from 'date-fns'
import { useTranslation } from "react-i18next"

type PostProps = {
  post: PostResponse
  onDelete: (id: string) => void
}

export const Post: React.FC<PostProps> = ({ post, onDelete }) => {
  const { t } = useTranslation()

  return (
    <div className={style.container}>
      <header className={style.header}>
        {format(parseISO(post.created_at), 'dd-MMM')}
      </header>
      <main className={style.main}>
        {post.text}
      </main>
      <footer className={style.footer}>
        <button onClick={() => onDelete(post.id)}>{t('delete')}</button>
      </footer>
    </div>
  )
}
