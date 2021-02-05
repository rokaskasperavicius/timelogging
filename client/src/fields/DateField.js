import React from 'react'
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers'
import { Controller, useFormContext } from 'react-hook-form'

const DateField = ({
  name,
  rules,
  views,
  style,
}) => {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ value, onChange }) => (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            // error
            // helperText='KYS'
            style={style}
            value={value}
            views={views}
            autoOk={true}
            okLabel=''
            onChange={onChange}
            format={'y LLLL'}
            // emptyLabel={'NNANANA'}
            showTodayButton
          />
        </MuiPickersUtilsProvider>
      )}
    />
  )
}

export default DateField