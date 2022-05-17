import PriceInput from "@app/financeiro/price-input";
import { TransactionResponse } from "@app/financeiro/transaction-response";
import useAuth from "@app/login/use-auth";
import React, { FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import style from "./style.module.scss";

export default function UpdateTransaction() {
  const baseUrl = import.meta.env.VITE_BASE_API_URL;

  const { t } = useTranslation();
  const params = useParams<{ id: string }>();
  const auth = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [amount, setAmount] = useState(0);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    fetch(`${baseUrl}/api/financeiro/transactions/${params.id}`, {
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${auth.accessToken}`,
      },
    })
      .then((res) => res.json() as Promise<TransactionResponse>)
      .then((data) => {
        setAmount(data.amount);
        setName(data.name);
        setDate(data.date.split("T")[0]);
        setPaid(data.paid);
        setIsLoading(false);
      });
  }, []);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetch(`${baseUrl}/api/financeiro/transactions/${params.id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${auth.accessToken}`,
      },
      body: JSON.stringify({
        name,
        date,
        paid,
        amount: parseInt(amount.toString(), 10),
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

  const onDeleteClick = () => {
    setIsLoading(true);
    fetch(`${baseUrl}/api/financeiro/transactions/${params.id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${auth.accessToken}`,
      },
    }).then((res) => {
      if (res.ok) {
        window.history.back();
      }
    });
  };

  return (
    <div className={style.container}>
      <h1>{t("update transaction")}</h1>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
          placeholder={t("name")}
          required
          disabled={isLoading}
        />
        <input
          type="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
          placeholder={t("date")}
          required
          disabled={isLoading}
        />
        <PriceInput
          onChange={onAmountChange}
          value={amount}
          required
          disabled={isLoading}
        />

        <input
          type="checkbox"
          name="paid"
          onChange={() => setPaid(!paid)}
          checked={paid}
          disabled={isLoading}
        />
        <label htmlFor="paid">{t("paid")}</label>

        <button type="submit" className={style.update} disabled={isLoading}>
          {t("update")}
        </button>
        <button
          type="button"
          className={style.delete}
          onClick={onDeleteClick}
          disabled={isLoading}
        >
          {t("delete")}
        </button>
      </form>
    </div>
  );
}
