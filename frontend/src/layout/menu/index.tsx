import useAuth from "@app/login/use-auth";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import style from "./style.module.scss";

type MenuProps = {
  onClick: (arg: any) => void;
};

export default function Menu({ onClick }: MenuProps) {
  const auth = useAuth();
  const { t, i18n } = useTranslation();

  const onChangeLanguageClick = () => {
    const lang = i18n.language === "en" ? "ptBr" : "en";
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    onClick(null);
  };

  return (
    <header className={style.container}>
      <nav>
        <ul>
          <li>
            <Link to="/" onClick={onClick}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/bloguinho" onClick={onClick}>
              Bloguinho
            </Link>
          </li>
          <li>
            <Link to="/financeiro" onClick={onClick}>
              Financeiro
            </Link>
          </li>
          <li>
            <Link to="/vagabundo" onClick={onClick}>
              Vagabundo
            </Link>
          </li>
          <li>
            <button
              className={style.logout}
              type="button"
              onClick={() => auth.signout()}
            >
              {t("logout")}
            </button>
          </li>
          <li>
            <button
              className={style.changeLanguage}
              onClick={onChangeLanguageClick}
              type="button"
            >
              {t("change language")}: {i18n.language}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
