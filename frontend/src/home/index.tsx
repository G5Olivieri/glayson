import Header from "@app/home/header";
import React from "react";
import { useTranslation } from "react-i18next";
import style from "./style.module.scss";

export default function Home() {
  const { t, i18n } = useTranslation();

  const onChangeLanguageClick = () => {
    const lang = i18n.language === "en" ? "ptBr" : "en";
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <div className={style.container}>
      <Header />
      <h1>Home</h1>
      <p>
        {t("language")}: {i18n.language}
      </p>
      <button onClick={onChangeLanguageClick} type="button">
        {t("change")}
      </button>
    </div>
  );
}
