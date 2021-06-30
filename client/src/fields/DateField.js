import { useRef } from 'react'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers'
import { Controller, useFormContext } from 'react-hook-form'

const DateField = ({ name, label, rules, views, style }) => {
  const { control } = useFormContext()
  const inputRef = useRef(null)

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
            inputRef={inputRef}
            inputVariant='outlined'
            style={style}
            label={label}
            value={value}
            views={views}
            clearable
            onClose={() => {
              // setTimeout(() => inputRef.current.blur(), 0)
            }}
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
