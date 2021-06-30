import { useRef } from 'react'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers'
import { Controller, useFormContext } from 'react-hook-form'

const DateTimeField = ({ name, rules, label, onChange: onChangeCustom }) => {
  const inputRef = useRef(null)

  const { control } = useFormContext()
  const initialFocusedDate = new Date(
    Math.floor(new Date().getTime() / (1000 * 60 * 5)) * 1000 * 60 * 5
  ) // Rounds to nearest 5 minutes

  return (
    <Controller
      id={name}
      name={name}
      control={control}
      rules={rules}
      render={({ value, onChange }) => (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DateTimePicker
            // error
            // helperText='KYS'
            value={value}
            inputVariant='outlined'
            onChange={(value) => {
              onChange(value)

              if (onChangeCustom) {
                onChangeCustom()
              }
            }}
            onClose={() => {
              // setTimeout(() => inputRef.current.blur(), 0)
            }}
            inputRef={inputRef}
            minutesStep={5}
            autoOk={true}
            clearable
            okLabel=''
            label={label}
            format={'y MMMM d, HH:mm'}
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
