import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import style from "./style.module.scss";

type CommentFormProps = {
  onNewComment(text: string): void;
};

export default function CommentForm({ onNewComment }: CommentFormProps) {
  const { t } = useTranslation();
  const [text, setText] = useState("");

  return (
    <form
      className={style.container}
      onSubmit={(event) => {
        event.preventDefault();
        onNewComment(text);
        setText("");
      }}
    >
      <textarea
        placeholder={t("commentary")}
        onChange={(event) => setText(event.target.value)}
        value={text}
      />
      <button type="submit">{t("comment")}</button>
    </form>
  );
}
