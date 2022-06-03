import { ExpenseResponse } from "@app/financeiro/expense-response";
import Expenses from "@app/financeiro/expenses";
import useAuthFetch from "@app/login/use-auth-fetch";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import style from "./style.module.scss";

export default function Financeiro() {
  const baseUrl = import.meta.env.VITE_BASE_API_URL;
  const { t } = useTranslation();
  const authFetch = useAuthFetch();

  const [expenses, setExpenses] = useState<{
    data: ExpenseResponse[];
  }>({ data: [] });
  const [month, setMonth] = useState(format(new Date(), "yyyy-MM"));

  useEffect(() => {
    authFetch(`${baseUrl}/api/financeiro/expenses?month=${month}`)
      .then((res) => res.json())
      .then((data) => setExpenses({ data }));
  }, [month]);

  const pay = async (transaction: ExpenseResponse) => {
    // eslint-disable-next-line camelcase
    const { id, name, amount, group_id, date, virtual } = transaction;
    const res = await authFetch(
      `${baseUrl}/api/financeiro/expenses/${id}/pay`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name,
          amount,
          date,
          // eslint-disable-next-line camelcase
          group_id,
          virtual,
        }),
      }
    );

    if (res.ok) {
      setExpenses({
        data: expenses.data.map((tr) =>
          tr.id === transaction.id ? { ...tr, paid: true } : tr
        ),
      });
    }
  };

  return (
    <div className={style.container}>
      <h1>Financeiro</h1>
      <Link to="new" className={style.new}>
        {t("new")}
      </Link>
      <input
        className={style.monthFilter}
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      />
      <Expenses expenses={expenses.data} pay={pay} />
    </div>
  );
}
