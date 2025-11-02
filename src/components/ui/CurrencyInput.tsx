
"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"

export interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: number | string;
  onValueChange: (value: number | undefined) => void;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

const parseCurrency = (value: string): number | undefined => {
    const isNegative = value.includes('-');
    const digits = value.replace(/\D/g, "");
    if (digits) {
        let numberValue = parseInt(digits, 10) / 100;
        if (isNegative) {
            numberValue = -numberValue;
        }
        return numberValue;
    }
    return undefined;
};


const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onValueChange, ...props }, ref) => {
    
    const [displayValue, setDisplayValue] = React.useState('');

    React.useEffect(() => {
        const numericValue = typeof value === 'string' ? parseCurrency(value) : value;
        if (numericValue !== undefined && !isNaN(numericValue)) {
            setDisplayValue(formatCurrency(numericValue));
        } else {
            setDisplayValue('');
        }
    }, [value]);


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputVal = event.target.value;
      const numericValue = parseCurrency(inputVal);

      if (numericValue !== undefined) {
        // We don't format here so the user can continue typing
        setDisplayValue(inputVal);
        onValueChange(numericValue);
      } else {
        setDisplayValue('');
        onValueChange(undefined);
      }
    };
    
    const handleBlur = () => {
        const numericValue = typeof value === 'string' ? parseCurrency(value) : value;
         if (numericValue !== undefined && !isNaN(numericValue)) {
            setDisplayValue(formatCurrency(numericValue));
        } else {
            setDisplayValue('');
        }
    }

    return (
      <Input
        {...props}
        ref={ref}
        type="text"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    )
  }
)
CurrencyInput.displayName = "CurrencyInput"

export { CurrencyInput }
