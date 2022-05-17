import { formatPrice } from '@app/financeiro/format-price';
import { TransactionResponse } from '@app/financeiro/transaction-response';
import { format } from 'date-fns';
import React, { MouseEvent, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import style from './style.module.scss';

type TransactionProps = {
  transaction: TransactionResponse
  pay: (transaction: TransactionResponse) => void
}

export const Transaction: React.FC<TransactionProps> = ({ transaction, pay }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const buttonRef = useRef<HTMLButtonElement>(null)

  const { id, name, date, amount, paid } = transaction

  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    if(buttonRef.current) {
      if(event.target === buttonRef.current) {
        pay(transaction)
        return
      }
    }
    navigate(`/financeiro/${id}`)
  }

  return (
    <div className={`${style.container} ${paid ? style.paid : ''}`} onClick={onClick}>
      <p className={style.name}>{name}</p>
      <p className={style.date}>{format(new Date(date), 'dd/MM/yyyy')}</p>
      <p className={style.amount}>{formatPrice(amount.toString(), ',', '.')}</p>
      {!paid && <button type="button" ref={buttonRef} className={style.pay} >{t('pay')}</button> }
    </div>
  )
}
