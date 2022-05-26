import { TransactionResponse } from "@app/financeiro/transaction-response";
import Transactions from "@app/financeiro/transactions";
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

  const [transactions, setTransactions] = useState<{
    data: TransactionResponse[];
  }>({ data: [] });
  const [month, setMonth] = useState(format(new Date(), "yyyy-MM"));

  useEffect(() => {
    authFetch(`${baseUrl}/api/financeiro/transactions?month=${month}`)
      .then((res) => res.json())
      .then((data) => setTransactions({ data }));
  }, [month]);

  const pay = async (transaction: TransactionResponse) => {
    const res = await authFetch(
      `${baseUrl}/api/financeiro/transactions/${transaction.id}/pay`
    );

    if (res.ok) {
      setTransactions({
        data: transactions.data.map((tr) =>
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
      <Transactions transactions={transactions.data} pay={pay} />
    </div>
  );
}
