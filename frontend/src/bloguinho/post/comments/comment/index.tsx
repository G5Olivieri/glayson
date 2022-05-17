import { CommentResponse } from "@app/bloguinho/post-response";
import { format, parseISO } from "date-fns";
import React from "react";
import { useTranslation } from "react-i18next";
import style from "./style.module.scss";

type CommentProps = {
  comment: CommentResponse;
  onDelete: (id: string) => void;
};

export default function Comment({ comment, onDelete }: CommentProps) {
  const { t } = useTranslation();

  return (
    <div className={style.container}>
      <header className={style.header}>
        {comment.username} - {format(parseISO(comment.created_at), "dd/MMM")}
      </header>
      <main className={style.main}>{comment.text}</main>
      <footer className={style.footer}>
        <button type="button" onClick={() => onDelete(comment.id)}>
          {t("delete")}
        </button>
      </footer>
    </div>
  );
}
