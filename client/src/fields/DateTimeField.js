import React from 'react'
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers'
import { Controller, useFormContext } from 'react-hook-form'

const DateTimeField = ({
  name,
  rules,
  onChange: onChangeCustom,
}) => {
  const { control } = useFormContext()
  const initialFocusedDate = new Date(Math.floor(new Date().getTime() / (1000 * 60 * 5)) * 1000 * 60 * 5) // Rounds to nearest 5 minutes

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ value, onChange }) => (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DateTimePicker
            // error
            // helperText='KYS'
            value={value}
            onChange={(value) => {
              onChange(value)

              if (onChangeCustom) {
                onChangeCustom()
              }
            }}
            minutesStep={5}
            autoOk={true}
            okLabel=''
            format={'y LLL d, HH:mm'}
            // emptyLabel={'NNANANA'}
            ampm={false}
            initialFocusedDate={initialFocusedDate}
            disableFuture
            showTodayButton
          />
        </MuiPickersUtilsProvider>
      )}
    />
  )
}

export default DateTimeField