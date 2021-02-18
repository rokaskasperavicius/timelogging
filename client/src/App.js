import React, { useState, useEffect, useRef, useMemo } from 'react'
import logo from './logo.svg'
import './App.css'
import {
  useQuery,
  useQueryClient,
  useInfiniteQuery,
  InfiniteQueryObserver,
} from 'react-query'

import {
  useLocation,
  useHistory,
} from "react-router-dom";


import formatISO from 'date-fns/formatISO'

import {DatePicker,
  TimePicker,
  DateTimePicker, } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import blue from "@material-ui/core/colors/blue";
import cyan from "@material-ui/core/colors/cyan";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { useForm, Controller, FormProvider } from "react-hook-form";

import { Stepper } from 'components'
import { Dropdown, Input } from 'semantic-ui-react'
import { Select, Ref } from 'semantic-ui-react'
import axios from 'axios'
import { format, add, differenceInHours, differenceInMinutes } from 'date-fns'

import { useInView } from 'react-intersection-observer';

import queryString from 'query-string'

import { DateTimeField, DateField, DropdownField, InputField, CheckboxField } from 'fields'

import { groupBy, map, chain, sortBy, upperFirst, concat, forEach } from 'lodash'

import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableContainer from '@material-ui/core/TableContainer'
import Tooltip from '@material-ui/core/Tooltip'
import CircularProgress from '@material-ui/core/CircularProgress';
import Zoom from '@material-ui/core/Zoom'
import { YearSelection } from '@material-ui/pickers/views/Year/YearView';

import { useFetch, usePaginator, useMutation } from 'hooks'

const options = [
  { key: 'English', text: 'English', value: 'English' },
  { key: 'French', text: 'French', value: 'French' },
  { key: 'Spanish', text: 'Spanish', value: 'Spanish' },
  { key: 'German', text: 'German', value: 'German' },
  { key: 'Chinese', text: 'Chinese', value: 'Chinese' },
]

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: `2px solid ${theme.palette.primary.main}`,
    // boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    outline: 0,
    borderRadius: '4px',
    color: theme.palette.text.primary
  },
  tooltip: {
    fontSize: '13px'
  }
}));

const App = () => {
  const classes = useStyles();
  const queryClient = useQueryClient()

  const [page, setPage] = useState(0)

  const history = useHistory()

  const { year = new Date().getFullYear(), month = format(new Date(), 'MMMM') } = queryString.parse(useLocation().search)

  // const { data: sortedCalendar, isLoading, isSuccess } = useQuery(['calendar', year, month], async () => {
  //   const res = await fetch(`/api/calendar?year=${year}&month=${month}&page=${1}`)
  //   const data = await res.json()
  //   return data
  // })

  // const data = useQuery(['test', year, month], null)

  // const a = useFetch(`/api/calendarr?year=${year}&month=${month}&page=${0}`)
  const [pages, pageCount, isLoading, clearPages, fetchUrl] = usePaginator(`/api/calendar?year=${year}&month=${month}&page=${page}`)

  const calendar = useMemo(() => pages && groupBy(concat(...Object.values(pages)), (values) =>
    format(new Date(values.startDate), 'yyyy MMMM dd')),
    [pages])

  // fetch(`/api/calendarr?year=${year}&month=${month}&page=${0}`)
  //   .then(data => data.json())
  //   .then(res => console.log({ res }))
  //   .catch(err => console.log(err))

  // , async ({ pageParam = 0 }) => {
  //   console.log(pageParam)
  //   const res = await fetch(`/api/calendar?year=${year}&month=${month}&page=${pageParam}`)
  //   const data = await res.json()
  //   setPageCount(data.pages)
  //   // return data.data

  //   queryClient.setQueryData(['test', year, month], 'test')
  // }, {
  //   // getNextPageParam: (lastPage, pages) => pages.length >= pageCount ? undefined : pages.length,
  //   getNextPageParam: undefined,
  // }

  // useEffect(() => {
  //   data.refetch()
  // }, [year, month])
  // console.log(data)

  // groupBy(sortBy(data, 'startDate'), (values) =>
  //   format(new Date(values.startDate), 'yyyy MMMM dd'))

  // const sortedCalendar = useMemo(() =>
  //   groupBy(sortBy(data, 'startDate'), (values) =>
  //     format(new Date(values.startDate), 'yyyy MMMM dd'))
  // , [data])
  const [open, setOpen] = React.useState(false)

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const methods = useForm({
    defaultValues: {
      startDate: null,
      endDate: null,
      logDate: null,
      task: null,
      isLogged: false,
    },
  })

  const data = []

  // const { data: tasks, refetch: refreshTasks } = useQuery('tasks', async () => {
  //   const { data } = await axios('/api/tasks')

  //   return data
  // })

  const { register, handleSubmit, watch, errors, control, reset, getValues, formState, setValue } = methods

  const [sendData, load] = useMutation('/api/calendar', 'The time has been added', {
    onSuccess: ({ year: logYear, month: logMonth }) => {
      if (logYear !== year || logMonth !== month) {
        history.push(`/calendar?year=${logYear}&month=${logMonth}`)
      } else {
        window.location.reload() // this is not okay
        // fetchUrl(`/api/calendar?year=${year}&month=${month}&page=${0}`)
      }
    }
  })
  console.log({ load })

  const onSubmit = (data) => {
    sendData({
      ...data,
      year: format(data.logDate, 'y'),
      month: format(data.logDate, 'LLLL'),
      createdAt: new Date(),
    })
  }

  // const mutation = useMutation(data => {
  //   return axios({
  //     method: 'post',
  //     url: '/api/calendar',
  //     data,
  //   });
  // }, {
  //   onSuccess: (data, { year, month }) => {
  //     queryClient.setQueryData(['calendar', year, month], groupBy(sortBy(data.data, 'startDate'), (values) =>
  //     format(new Date(values.startDate), 'yyyy MMMM dd')))
  //     refreshTasks()
  //     history.push(`/calendar?year=${year}&month=${month}`)
  //   },
  // })

  const handleDateChange = () => {
    const startDate = getValues('startDate')
    const endDate = getValues('endDate')

    if (startDate && endDate) {
      const year = startDate.getFullYear()
      let month = startDate.getMonth()
      const date = startDate.getDate()
      
      if (date >= 20) {
        month++
      }
      console.log(new Date(year, month))
      setValue('logDate', new Date(year, month))
      console.log(getValues('logDate'))
    }
  }

  const { ref, inView } = useInView({
    root: document.getElementById('test'),
    rootMargin: '0px 0px 0px 0px',
    initialInView: false,
  });

  useEffect(() => {
    if (inView && !isLoading) {
      setPage(p => p + 1) // fix this
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  const addMonth = (monthCount) => {
    setPage(0)
    clearPages()

    const newDate = add(new Date(`${year} ${month}`), { months: monthCount })
    history.push(`/calendar?year=${newDate.getFullYear()}&month=${format(newDate, 'MMMM')}`)
  }

  const logDate = watch('logDate')

  return (
    <div className="App">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          log time
        </Button>
        <div style={{ color: 'white', display: 'flex', alignItems: 'center' }}>
          <Button variant='outlined' color="primary" onClick={() => addMonth(-1)}><ArrowBackIcon /></Button>
          <span>&nbsp;&nbsp;{year}</span>
          <span style={{ width: '71px', textAlign: 'center' }}>{upperFirst(month.toLowerCase())}&nbsp;</span>
          <Button variant='outlined' color="primary" onClick={() => addMonth(1)}><ArrowForwardIcon /></Button>
        </div>
      </div>
      <div style={{ marginTop: '20px' }}>
        <TableContainer id='test' style={{ maxHeight: '90vh' }}>
          <Table stickyHeader size='small'>
            <TableHead>
              <TableRow>
                <TableCell style={{ borderBottomColor: '#303030' }} size='medium'>Task</TableCell>
                <TableCell style={{ borderBottomColor: '#303030' }} size='medium'>Time spent</TableCell>
                <TableCell style={{ borderBottomColor: '#303030' }} size='medium'>Time range</TableCell>
                <TableCell style={{ borderBottomColor: '#303030', maxWidth: '100px' }} size='medium'>Task description</TableCell>
                <TableCell style={{ borderBottomColor: '#303030' }} size='medium'>Task status</TableCell>
                <TableCell style={{ borderBottomColor: '#303030' }} colSpan={2} size='medium' align='center'>Actions</TableCell>
              </TableRow>
            </TableHead>
            {map(calendar, (dates, logDate) => (
              <React.Fragment>
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={7} style={{ top: '54px' }} size='medium'>{logDate}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dates.map((values, index) => (
                    <TableRow>
                      <TableCell>{values.task}</TableCell>
                      <TableCell>{differenceInHours(new Date(values.endDate), new Date(values.startDate))}h {differenceInMinutes(new Date(values.endDate), new Date(values.startDate)) - (60 * differenceInHours(new Date(values.endDate), new Date(values.startDate)))}m</TableCell>
                      <TableCell>{`(${format(new Date(values.startDate), 'HH.mm')}`} &ndash; {format(new Date(values.endDate), 'HH.mm')})</TableCell>
                      <TableCell style={{ maxWidth: '100px' }}>{values.description}</TableCell>
                      <TableCell>{values.isLogged ? 'Logged' : 'Not logged'}</TableCell>
                      <TableCell style={{ width: '10px' }}>
                        <Tooltip classes={{ tooltip: classes.tooltip }} title='Edit' placement="top" TransitionComponent={Zoom} arrow>
                          <IconButton color='primary'>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell style={{ width: '10px' }}>
                        <Tooltip classes={{ tooltip: classes.tooltip }} title='Delete' placement="top" TransitionComponent={Zoom} arrow>
                          <IconButton color='secondary'>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </React.Fragment>
            ))}
          </Table>
          {!isLoading && pageCount === 0 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '80px',
              color: 'white',
              fontSize: '15px'
            }}>No times to render</div>
          )}


          {(page + 1 < pageCount || isLoading) && (
            <div ref={ref} style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '80px',
            }}>
              <CircularProgress />
            </div>
          )}
        </TableContainer>
      </div>

      <Modal
        open={open}
        className={classes.modal}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
      >
        <Fade in={open}>
          <div className={classes.paper}> 
            <FormProvider {...methods} >
              <form onSubmit={handleSubmit(onSubmit)}>
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
                  style={{ display: logDate ? 'unset' : 'none' }}
                  name='logDate'
                  views={['year', 'month']}
                  rules={{
                    required: true,
                  }}
                />
                <DropdownField
                  name='task'
                  options={[]}
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
                {/* <button
                  type="button"
                  onClick={() => reset({
                    startDate: null,
                    endDate: null,
                  })}
                >
                  Reset Form
                </button> */}
                <Button
                  type={'submit'}
                  variant="contained"
                  color="primary"
                >
                  Submit
                </Button>
              </form>
            </FormProvider>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

export default App
