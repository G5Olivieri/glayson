import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import style from './style.module.scss'
import { Transactions } from '@app/financeiro/transactions';
import { useAuth } from '@app/login/use-auth';
import { TransactionResponse } from '@app/financeiro/transaction-response';

export const Financeiro: React.FC = () => {
  const baseUrl = import.meta.env.VITE_BASE_API_URL;
  const auth = useAuth()
  const { t } = useTranslation()
  const [transactions, setTransactions] = useState<{ data: TransactionResponse[] }>({ data: [] })

  const pay = (t: TransactionResponse) => {
    fetch(`${baseUrl}/api/financeiro/transactions/${t.id}/pay`, {
      headers: {
        'authorization': `Bearer ${auth.accessToken}`
      },
    }).then(res => {
      if (res.ok) {
        setTransactions({ data: transactions.data.map(tr => tr.id === t.id ? {...tr, paid: true} : tr) })
      }
    })
  }

  useEffect(() => {
    fetch(`${baseUrl}/api/financeiro/transactions`, {
      headers: {
        'Authorization': `Bearer ${auth.accessToken}`
      }
    }).then(res => res.json())
      .then((data) => setTransactions({ data }))
  }, [])


  return (
    <div className={style.container}>
      <h1>Financeiro</h1>
      <Link to="new" className={style.new}>{t('new')}</Link>
      <Transactions transactions={transactions.data} pay={pay} />
    </div>
  )
}
