import useAuth from "@app/login/use-auth";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Header() {
  const { t } = useTranslation();
  const auth = useAuth();

  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/bloguinho">Bloguinho</Link>
          </li>
          <li>
            <Link to="/financeiro">Financeiro</Link>
          </li>
          <li>
            <button type="button" onClick={() => auth.signout()}>
              {t("logout")}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
