import { PriceInput } from '@app/financeiro/price-input';
import { useAuth } from '@app/login/use-auth';
import { format } from 'date-fns';
import React, { FormEvent, KeyboardEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import style from './style.module.scss';

export const NewTransaction: React.FC = () => {
  const baseUrl = import.meta.env.VITE_BASE_API_URL;

  const { t } = useTranslation()
  const navigate = useNavigate()
  const auth = useAuth()

  const [amount, setAmount] = useState(0)
  const [name, setName] = useState('')
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [paid, setPaid] = useState(false)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    fetch(`${baseUrl}/api/financeiro/transactions`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${auth.accessToken}`
      },
      body: JSON.stringify({
        name,
        date,
        paid,
        amount,
      })
    }).then((res) => {
      if (res.ok) {
        navigate('/financeiro')
      }
    })
  }

  const onAmountChange = (newPrice: number) => {
    setAmount(newPrice)
  }

  return (
    <div className={style.container}>
      <h1>{t('new transaction')}</h1>
      <form onSubmit={onSubmit}>
        <input type="text" onChange={e => setName(e.target.value)} value={name} placeholder={t('name')} required autoFocus />
        <input type="date" onChange={e => setDate(e.target.value)} value={date} placeholder={t('date')} required />
        <PriceInput onChange={onAmountChange} value={amount} required />

        <label>
          <input type="checkbox" name="paid" onChange={() => setPaid(!paid)} checked={paid} />{' '}
          {t('paid')}
        </label>

        <button type="submit">{t('create')}</button>
      </form>
    </div>
  )
}
