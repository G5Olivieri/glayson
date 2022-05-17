import formatPrice from "@app/financeiro/format-price";
import { TransactionResponse } from "@app/financeiro/transaction-response";
import { format, parseISO } from "date-fns";
import React, { MouseEvent, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import style from "./style.module.scss";

type TransactionProps = {
  transaction: TransactionResponse;
  pay: (transaction: TransactionResponse) => void;
};

export default function Transaction({ transaction, pay }: TransactionProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { id, name, date, amount, paid } = transaction;

  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    if (buttonRef.current) {
      if (event.target === buttonRef.current) {
        pay(transaction);
        return;
      }
    }
    navigate(`/financeiro/${id}`);
  };

  const onKeyDown = () => {
    /* empty */
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={`${style.container} ${paid ? style.paid : ""}`}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      <p className={style.name}>{name}</p>
      <p className={style.date}>
        {format(parseISO(date.split("T")[0]), "dd/MM/yyyy")}
      </p>
      <p className={style.amount}>{formatPrice(amount.toString(), ",", ".")}</p>
      {!paid && (
        <button type="button" ref={buttonRef} className={style.pay}>
          {t("pay")}
        </button>
      )}
    </div>
  );
}
