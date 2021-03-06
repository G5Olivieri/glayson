import useAuthFetch from "@app/login/use-auth-fetch";
import React, { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import style from "./style.module.scss";

export default function NewTask() {
  const baseUrl = import.meta.env.VITE_BASE_API_URL;
  const { t } = useTranslation();
  const authFetch = useAuthFetch();
  const [name, setName] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    authFetch(`${baseUrl}/api/vagabundo/tasks`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name,
      }),
    }).then((res) => {
      if (res.ok) {
        window.history.back();
      }
    });
  };

  return (
    <div className={style.container}>
      <h1>{t("new task")}</h1>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
          placeholder={t("name")}
          required
        />
        <button type="submit">{t("create")}</button>
      </form>
    </div>
  );
}
