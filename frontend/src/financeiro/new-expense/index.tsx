import PriceInput from "@app/financeiro/price-input";
import useAuthFetch from "@app/login/use-auth-fetch";
import { format } from "date-fns";
import React, { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import style from "./style.module.scss";

export default function NewExpense() {
  const baseUrl = import.meta.env.VITE_BASE_API_URL;

  const { t } = useTranslation();
  const authFetch = useAuthFetch();

  const [amount, setAmount] = useState(0);
  const [name, setName] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [paid, setPaid] = useState(false);
  const [split, setSplit] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [amountOfSplits, setAmountOfSplits] = useState(0);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    authFetch(`${baseUrl}/api/financeiro/expenses`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name,
        date,
        paid: !repeat && paid,
        amount,
        repeat,
        amountOfSplits,
      }),
    }).then((res) => {
      if (res.ok) {
        // TODO: go to "financeiro" page without back to "new transaction" page
        window.history.back();
      }
    });
  };

  const onAmountChange = (newPrice: number) => {
    setAmount(newPrice);
  };

  return (
    <div className={style.container}>
      <h1>{t("new expense")}</h1>
      <form onSubmit={onSubmit}>
        <input
          className={style.formControl}
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
          placeholder={t("name")}
          required
        />

        <div className={style.splitContainer}>
          <input
            className={style.formControl}
            type="checkbox"
            name="split"
            onChange={() => setRepeat(!repeat)}
            checked={repeat}
            id="repeat"
          />{" "}
          <label htmlFor="repeat">{t("repeat")}</label>
        </div>
        {repeat && (
          <div>
            <div className={style.splitContainer}>
              <input
                className={style.formControl}
                type="checkbox"
                name="split"
                onChange={() => setSplit(!split)}
                checked={split}
                id="split"
              />{" "}
              <label htmlFor="split">{t("split")}</label>
            </div>
            {split && (
              <input
                className={style.formControl}
                type="number"
                min="1"
                onChange={(event) =>
                  setAmountOfSplits(parseInt(event.target.value, 10))
                }
                value={amountOfSplits === 0 ? "" : amountOfSplits}
                required
                placeholder={t("amount of splits")}
              />
            )}
          </div>
        )}
        <input
          className={style.formControl}
          type="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
          placeholder={t("date")}
          required
        />
        <PriceInput
          className={style.formControl}
          onChange={onAmountChange}
          value={amount}
          required
        />
        <div className={style.paidContainer}>
          <input
            className={style.formControl}
            type="checkbox"
            name="paid"
            onChange={() => setPaid(!paid)}
            checked={!repeat && paid}
            disabled={repeat}
            id="paid"
          />{" "}
          <label htmlFor="paid">{t("paid")}</label>
        </div>
        <button className={style.formControl} type="submit">
          {t("create")}
        </button>
      </form>
    </div>
  );
}
