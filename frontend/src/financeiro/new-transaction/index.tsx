import PriceInput from "@app/financeiro/price-input";
import useAuth from "@app/login/use-auth";
import { format } from "date-fns";
import React, { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import style from "./style.module.scss";

export default function NewTransaction() {
  const baseUrl = import.meta.env.VITE_BASE_API_URL;

  const { t } = useTranslation();
  const auth = useAuth();

  const [amount, setAmount] = useState(0);
  const [name, setName] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [paid, setPaid] = useState(false);
  const [split, setSplit] = useState(false);
  const [amountOfSplits, setAmountOfSplits] = useState(0);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetch(`${baseUrl}/api/financeiro/transactions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${auth.accessToken}`,
      },
      body: JSON.stringify({
        name,
        date,
        paid,
        amount,
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
      <h1>{t("new transaction")}</h1>
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
            checked={paid}
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
