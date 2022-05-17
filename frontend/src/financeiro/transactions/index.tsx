import { TransactionResponse } from "@app/financeiro/transaction-response";
import Transaction from "@app/financeiro/transactions/transaction";
import React from "react";
import style from "./style.module.scss";

export type TransactionsProps = {
  transactions: TransactionResponse[];
  pay: (transaction: TransactionResponse) => void;
};

export default function Transactions({ transactions, pay }: TransactionsProps) {
  return (
    <ul className={style.container}>
      {transactions.map((t) => (
        <li key={t.id}>
          <Transaction transaction={t} pay={pay} />
        </li>
      ))}
    </ul>
  );
}
