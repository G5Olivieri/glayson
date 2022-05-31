import { ExpenseResponse } from "@app/financeiro/expense-response";
import Expense from "@app/financeiro/expenses/expense";
import React from "react";
import style from "./style.module.scss";

export type ExpensesProps = {
  expenses: ExpenseResponse[];
  pay: (transaction: ExpenseResponse) => void;
};

export default function Expenses({ expenses, pay }: ExpensesProps) {
  return (
    <ul className={style.container}>
      {expenses.map((t) => (
        <li key={t.id}>
          <Expense transaction={t} pay={pay} />
        </li>
      ))}
    </ul>
  );
}
