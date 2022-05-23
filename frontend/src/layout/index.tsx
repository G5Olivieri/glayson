import Menu from "@app/layout/menu";
import React, { useState } from "react";
import { Outlet } from "react-router";
import style from "./style.module.scss";

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={style.container}>
      <button
        className={style.menuButton}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        MENU
      </button>
      {isOpen && (
        <div className={style.menu}>
          <Menu onClick={() => setIsOpen(false)} />
        </div>
      )}
      <Outlet />
    </div>
  );
}
