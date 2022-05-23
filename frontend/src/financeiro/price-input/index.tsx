import formatPrice from "@app/financeiro/format-price";
import React, { ChangeEvent, useState } from "react";

type PriceInputProps = {
  onChange: (priceInCents: number) => void;
  value: number;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

export default function PriceInput({
  value,
  onChange,
  required,
  disabled,
  className,
}: PriceInputProps) {
  const [oldValue, setOldValue] = useState(
    formatPrice(value.toString(), ",", ".")
  );

  const backspaceKeyUp = () => {
    if (value === 0) {
      return oldValue;
    }

    if (value < 10) {
      onChange(0);
      return formatPrice("0", ",", ".");
    }

    const onlyDigit = value.toString();
    const newPrice = parseInt(onlyDigit.substring(0, onlyDigit.length - 1), 10);
    onChange(newPrice);
    return formatPrice(newPrice.toString(), ",", ".");
  };

  const digitKeyUp = (digit: string) => {
    const onlyDigit = value.toString();
    const numberPrice = parseInt(onlyDigit, 10) * 10 + parseInt(digit, 10);
    onChange(numberPrice);
    return formatPrice(numberPrice.toString(), ",", ".");
  };

  const onInput = (event: ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    if (rawValue.length < oldValue.length) {
      setOldValue(backspaceKeyUp());
      return;
    }
    const digit = rawValue.substring(oldValue.length);

    if (
      digit.charCodeAt(0) <= "9".charCodeAt(0) &&
      digit.charCodeAt(0) >= "0".charCodeAt(0)
    ) {
      setOldValue(digitKeyUp(digit));
    }
  };

  return (
    <input
      className={className}
      inputMode="numeric"
      disabled={disabled}
      required={required}
      onInput={onInput}
      value={formatPrice(value.toString(), ",", ".")}
    />
  );
}

PriceInput.defaultProps = {
  required: false,
  disabled: false,
  className: "",
};
