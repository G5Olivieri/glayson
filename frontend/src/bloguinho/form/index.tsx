import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import style from "./style.module.scss";

type PostFormProps = {
  onNewPost(text: string): void;
};

export default function PostForm({ onNewPost }: PostFormProps) {
  const { t } = useTranslation();
  const [text, setText] = useState("");

  return (
    <form
      className={style.container}
      onSubmit={(event) => {
        event.preventDefault();
        onNewPost(text);
        setText("");
      }}
    >
      <textarea
        onChange={(event) => setText(event.target.value)}
        value={text}
        required
      />
      <button type="submit">{t("submit")}</button>
    </form>
  );
}
