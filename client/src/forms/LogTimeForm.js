import { Button, makeStyles } from '@material-ui/core'
import { FormProvider, useForm } from 'react-hook-form'
import { format } from 'date-fns'
import { useLocation, useHistory } from 'react-router-dom'

import {
  DateTimeField,
  DateField,
  DropdownField,
  InputField,
  CheckboxField,
} from 'fields'
import { useFetch, useMutation } from 'hooks'

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 'unset',

    '& > *:not(:first-child)': {
      marginTop: '20px',
    },
  },
}))

export const LogTimeForm = ({ year, month, resetPaginator }) => {
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
  const classes = useStyles()

  const [tasks] = useFetch('/api/tasks')
  const history = useHistory()

  const [sendData] = useMutation('/api/calendar', 'The time has been added', {
    onSuccess: ({ year: logYear, month: logMonth }) => {
      if (logYear === year && logMonth === month) {
        resetPaginator()
      } else {
        history.push(`/calendar?year=${logYear}&month=${logMonth}`)
      }
    },
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
      <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
        <DateTimeField
          label='Task start time'
          name='startDate'
          onChange={handleDateChange}
          rules={{
            required: true,
            validate: (value) => value < getValues('endDate'),
          }}
        />
        <DateTimeField
          label='Task end time'
          name='endDate'
          onChange={handleDateChange}
          rules={{
            required: true,
            validate: (value) => value > getValues('startDate'),
          }}
        />
        <DateField
          name='logDate'
          label='Logged month'
          views={['year', 'month']}
          rules={{
            required: true,
          }}
        />
        <DropdownField
          name='task'
          label='Select task ID'
          options={tasks}
          rules={{
            required: true,
          }}
        />
        <InputField
          name='description'
          label='Task description'
          multiline={true}
          rules={{
            required: true,
          }}
        />
        <CheckboxField name='isLogged' label='Is tasked logged?' />
        <Button type='submit' variant='contained' color='primary'>
          Add time
        </Button>
      </form>
    </FormProvider>
  )
}
