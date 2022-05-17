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
      }),
    }).then((res) => {
      if (res.ok) {
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
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
          placeholder={t("name")}
          required
        />
        <input
          type="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
          placeholder={t("date")}
          required
        />
        <PriceInput onChange={onAmountChange} value={amount} required />
        <input
          type="checkbox"
          name="paid"
          onChange={() => setPaid(!paid)}
          checked={paid}
        />{" "}
        <label htmlFor="paid">{t("paid")}</label>
        <button type="submit">{t("create")}</button>
      </form>
    </div>
  );
}
