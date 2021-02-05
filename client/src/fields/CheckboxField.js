import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import { Controller, useFormContext } from 'react-hook-form'

const DateField = ({
  name,
  rules,
}) => {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ value, onChange }) => (
        <Checkbox
          checked={value}
          color='primary'
          onChange={e => onChange(e.target.checked)}
        />
      )}
    />
  )
}

export default DateField