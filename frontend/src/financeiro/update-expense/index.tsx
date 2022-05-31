import PriceInput from "@app/financeiro/price-input";
import { ExpenseResponse } from "@app/financeiro/expense-response";
import useAuthFetch from "@app/login/use-auth-fetch";
import React, { FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import style from "./style.module.scss";

export default function UpdateExpense() {
  const baseUrl = import.meta.env.VITE_BASE_API_URL;

  const { t } = useTranslation();
  const params = useParams<{ id: string }>();
  const authFetch = useAuthFetch();

  const [isLoading, setIsLoading] = useState(true);
  const [amount, setAmount] = useState(0);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    authFetch(`${baseUrl}/api/financeiro/expenses/${params.id}`, {
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json() as Promise<ExpenseResponse>)
      .then((data) => {
        setAmount(data.amount);
        setName(data.name);
        setDate(data.date.split("T")[0]);
        setPaid(data.paid);
        setIsLoading(false);
      });
  }, []);

  const backIfSuccess = (res: Response) => {
    if (res.ok) {
      window.history.back();
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    authFetch(`${baseUrl}/api/financeiro/expenses/${params.id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name,
        date,
        paid,
        amount: parseInt(amount.toString(), 10),
      }),
    }).then(backIfSuccess);
  };

  const onAmountChange = (newPrice: number) => {
    setAmount(newPrice);
  };

  const onDeleteClick = () => {
    setIsLoading(true);
    authFetch(`${baseUrl}/api/financeiro/expenses/${params.id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
    }).then(backIfSuccess);
  };

  return (
    <div className={style.container}>
      <h1>{t("update expense")}</h1>
      <form onSubmit={onSubmit}>
        <input
          className={style.formControl}
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
          placeholder={t("name")}
          required
          disabled={isLoading}
        />
        <input
          className={style.formControl}
          type="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
          placeholder={t("date")}
          required
          disabled={isLoading}
        />
        <PriceInput
          className={style.formControl}
          onChange={onAmountChange}
          value={amount}
          required
          disabled={isLoading}
        />

        <div className={style.paidContainer}>
          <input
            className={style.formControl}
            type="checkbox"
            name="paid"
            id="paid"
            onChange={() => setPaid(!paid)}
            checked={paid}
            disabled={isLoading}
          />
          <label htmlFor="paid">{t("paid")}</label>
        </div>

        <button
          type="submit"
          className={`${style.formControl} ${style.update}`}
          disabled={isLoading}
        >
          {t("update")}
        </button>
        <button
          type="button"
          className={`${style.formControl} ${style.delete}`}
          onClick={onDeleteClick}
          disabled={isLoading}
        >
          {t("delete")}
        </button>
      </form>
    </div>
  );
}