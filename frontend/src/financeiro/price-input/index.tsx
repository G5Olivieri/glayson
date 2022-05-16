import { formatPrice } from '@app/financeiro/format-price'
import React, { ChangeEvent, ChangeEventHandler, KeyboardEvent, useState, useSyncExternalStore } from 'react'

type PriceInputProps = {
  onChange: (priceInCents: number) => void
  value: number
  required?: boolean
}

export const PriceInput: React.FC<PriceInputProps> = ({ value, onChange, required }) => {
  const [oldValue, setOldValue] = useState(formatPrice(value.toString(), ',', '.'))

  const backspaceKeyUp = () => {
    if (value === 0) {
      return oldValue
    }

    if (value < 10) {
      onChange(0)
      return formatPrice('0', ',', '.')
    }

    const onlyDigit = value.toString()
    const newPrice = parseInt(onlyDigit.substring(0, onlyDigit.length - 1))
    onChange(newPrice)
    return formatPrice(newPrice.toString(), ',', '.')
  }

  const digitKeyUp = (digit: string) => {
    const onlyDigit = value.toString()
    const numberPrice = parseInt(onlyDigit) * 10 + parseInt(digit)
    onChange(numberPrice)
    return formatPrice(numberPrice.toString(), ',', '.')
  }

  const onInput = (event: ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value
    if (rawValue.length < oldValue.length) {
      setOldValue(backspaceKeyUp())
      return
    }
    const digit = rawValue.substring(oldValue.length)

    if (digit.charCodeAt(0) <= '9'.charCodeAt(0) && digit.charCodeAt(0) >= '0'.charCodeAt(0)) {
      setOldValue(digitKeyUp(digit))
      return
    }
  }

  return (
    <input inputMode='numeric' required={required} onInput={onInput} value={formatPrice(value.toString(), ',', '.')} />
  )
}
