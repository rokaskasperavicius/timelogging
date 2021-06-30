import React from 'react'
import { Checkbox, FormControlLabel } from '@material-ui/core'
import { Controller, useFormContext } from 'react-hook-form'

const DateField = ({ name, rules, label }) => {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ value, onChange }) => (
        <FormControlLabel
          label={label}
          control={
            <Checkbox
              checked={value}
              color='primary'
              onChange={(e) => onChange(e.target.checked)}
            />
          }
        />
      )}
    />
  )
}

export default DateField
