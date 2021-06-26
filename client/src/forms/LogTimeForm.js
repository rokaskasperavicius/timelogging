import { Button } from '@material-ui/core'
import { FormProvider, useForm } from 'react-hook-form'
import { format } from 'date-fns'

import {
  DateTimeField,
  DateField,
  DropdownField,
  InputField,
  CheckboxField,
} from 'fields'
import { useFetch, useMutation } from 'hooks'

const LogTimeForm = ({
  year,
  month,
  resetPaginator,
  history,
}) => {
  const methods = useForm({
    defaultValues: {
      startDate: null,
      endDate: null,
      logDate: null,
      task: null,
      isLogged: false,
    },
  })
  const { handleSubmit, getValues, setValue } = methods

  const [tasks] = useFetch('/api/tasks')

  const [sendData] = useMutation('/api/calendar', 'The time has been added', {
    onSuccess: ({ year: logYear, month: logMonth }) => {
      if (logYear === year && logMonth === month) {
        resetPaginator() // Check wether the useState is async or sync
        // fetchTasks()
      } else {
        history.push(`/calendar?year=${logYear}&month=${logMonth}`)
      }
    }
  })

  const handleDateChange = () => {
    const startDate = getValues('startDate')
    const endDate = getValues('endDate')

    if (startDate && endDate) {
      const year = startDate.getFullYear()
      let month = startDate.getMonth()
      const date = startDate.getDate()
      
      if (date >= 20) month++

      setValue('logDate', new Date(year, month))
    }
  }

  const onSubmit = (data) => {
    sendData({
      ...data,
      year: format(data.logDate, 'y'),
      month: format(data.logDate, 'LLLL'),
      createdAt: new Date(),
    })
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit((onSubmit))}
      >
        <DateTimeField
          name='startDate'
          onChange={handleDateChange}
          rules={{
            required: true,
            validate: value => value < getValues('endDate')
          }}
        />
        <DateTimeField
          name='endDate'
          onChange={handleDateChange}
          rules={{
            required: true,
            validate: value => value > getValues('startDate')
          }}
        />
        <DateField
          name='logDate'
          views={['year', 'month']}
          rules={{
            required: true,
          }}
        />
        <DropdownField
          name='task'
          options={tasks}
          rules={{
            required: true,
          }}
        />
        <InputField
          name='description'
          multiline={true}
          rules={{
            required: true,
          }}
        />
        <CheckboxField
          name='isLogged'
        />
        <Button
          type='submit'
          variant='contained'
          color='primary'
        >
          Add time
        </Button>
      </form>
    </FormProvider>
  )
}

export default LogTimeForm
