import React from "react";
import { PostResponse } from "@app/bloguinho/post-response";
import { format, parseISO } from "date-fns";
import { useTranslation } from "react-i18next";
import style from "./style.module.scss";

type PostProps = {
  post: PostResponse;
  onDelete: (id: string) => void;
};

export default function Post({ post, onDelete }: PostProps) {
  const { t } = useTranslation();

  return (
    <div className={style.container}>
      <header className={style.header}>
        {format(parseISO(post.created_at), "dd-MMM")}
      </header>
      <main className={style.main}>{post.text}</main>
      <footer className={style.footer}>
        <button type="button" onClick={() => onDelete(post.id)}>
          {t("delete")}
        </button>
      </footer>
    </div>
  );
}
