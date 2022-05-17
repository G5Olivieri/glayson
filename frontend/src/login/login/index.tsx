import useAuth from "@app/login/use-auth";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import style from "./style.module.scss";

export default function Login() {
  const { t } = useTranslation();
  const auth = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    auth.signin({
      username,
      password,
    });
  };

  const onUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const onPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <div className={style.container}>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          required
          onChange={onUsernameChange}
          value={username}
        />
        <input
          type="password"
          required
          onChange={onPasswordChange}
          value={password}
        />
        <button type="submit">{t("submit")}</button>
      </form>
    </div>
  );
}
