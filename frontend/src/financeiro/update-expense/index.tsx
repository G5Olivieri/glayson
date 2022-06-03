import { ExpenseResponse } from "@app/financeiro/expense-response";
import PriceInput from "@app/financeiro/price-input";
import useAuthFetch from "@app/login/use-auth-fetch";
import useQuery from "@app/use-query";
import { format } from "date-fns";
import React, { FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { useParams } from "react-router-dom";
import style from "./style.module.scss";

export default function UpdateExpense() {
  const baseUrl = import.meta.env.VITE_BASE_API_URL;

  const { t } = useTranslation();
  const params = useParams<{ id: string }>();
  const { search } = useLocation();
  const query = useQuery();
  const authFetch = useAuthFetch();

  const [isLoading, setIsLoading] = useState(true);
  const [amount, setAmount] = useState(0);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [paid, setPaid] = useState(false);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [onlyThisOne, setOnlyThisOne] = useState(true);

  useEffect(() => {
    authFetch(`${baseUrl}/api/financeiro/expenses/${params.id}${search}`, {
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
        setGroupId(data.group_id);
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
    authFetch(`${baseUrl}/api/financeiro/expenses/${params.id}${search}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name,
        date,
        amount: parseInt(amount.toString(), 10),
        paid,
        group_id: groupId,
        only_this_one: paid || onlyThisOne,
      }),
    }).then(backIfSuccess);
  };

  const onAmountChange = (newPrice: number) => {
    setAmount(newPrice);
  };

  const onDeleteClick = () => {
    setIsLoading(true);
    const month = format(new Date(date), "yyyy-MM");
    const virtual = query.get("virtual") ?? "false";
    const qs = new URLSearchParams({
      virtual,
      month,
      only_this_one: onlyThisOne.toString(),
    });

    if (groupId) {
      qs.set("group_id", groupId);
    }

    authFetch(
      `${baseUrl}/api/financeiro/expenses/${params.id}?${qs.toString()}`,
      {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
      }
    ).then(backIfSuccess);
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

        <div className={style.checkbox}>
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

        {groupId && (
          <div className={style.checkbox}>
            <input
              className={style.formControl}
              type="checkbox"
              id="onlyThisOne"
              onChange={() => setOnlyThisOne(!onlyThisOne)}
              checked={paid || onlyThisOne}
              disabled={isLoading || paid}
            />
            <label htmlFor="onlyThisOne">{t("only this one")}</label>
          </div>
        )}

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
