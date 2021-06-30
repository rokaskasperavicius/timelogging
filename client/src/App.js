import React, { useState, useEffect, useMemo } from 'react'

import { useLocation, useHistory } from 'react-router-dom'

// material-ui
import AddIcon from '@material-ui/icons/Add'
import { useForm, FormProvider } from 'react-hook-form'

import {
  Drawer,
  Button,
  Modal,
  Backdrop,
  IconButton,
  Fade,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Tooltip,
  CircularProgress,
  Zoom,
  makeStyles,
} from '@material-ui/core'

import { format, add, differenceInHours, differenceInMinutes } from 'date-fns'

import { useInView } from 'react-intersection-observer'

import queryString from 'query-string'

import {
  DateTimeField,
  DateField,
  DropdownField,
  InputField,
  CheckboxField,
} from 'fields'

import { groupBy, map, upperFirst, concat } from 'lodash'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'

import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'

import { useFetch, usePaginator, useMutation } from 'hooks'

import { LogTimeForm } from 'forms'

import { useModalContext } from 'context'
import './App.css'

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
    color: theme.palette.text.primary,
  },
  tooltip: {
    fontSize: '13px',
  },
}))

const App = () => {
  const classes = useStyles()
  const history = useHistory()

  const { setModalProps } = useModalContext()

  const {
    year = new Date().getFullYear(),
    month = format(new Date(), 'MMMM'),
  } = queryString.parse(useLocation().search)

  const [
    pages,
    { page, setPage, pageCount },
    isLoading,
    resetPaginator,
    fetchCalendar,
  ] = usePaginator(`/api/calendar?year=${year}&month=${month}`)

  const calendar = useMemo(
    () =>
      pages &&
      groupBy(concat(...Object.values(pages)), (values) =>
        format(new Date(values.startDate), 'yyyy MMMM dd')
      ),
    [pages]
  )

  const [{ minutes }] = useFetch(`/api/hours?year=${year}&month=${month}`)

  const [open, setOpen] = React.useState(false)

  const handleOpen = () => {
    setModalProps({
      component: <LogTimeForm />,
      props: {
        year,
        month,
        resetPaginator,
        fetchCalendar,
        history,
      },
    })
  }

  const handleClose = () => {
    setOpen(false)
  }

  const [test, setTest] = useState(true)

  const { ref, inView } = useInView({
    root: document.getElementById('test'),
    rootMargin: '0px 0px 0px 0px',
    initialInView: false,
  })

  const [testt, setTestt] = useState(true)

  useEffect(() => {
    // if (inView && !isLoading) {
    //   setPage(p => p + 1) // fix this
    // }
    console.log({ inView })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  const addMonth = (monthCount) => {
    resetPaginator()

    const newDate = add(new Date(`${year} ${month}`), { months: monthCount })
    history.push(
      `/calendar?year=${newDate.getFullYear()}&month=${format(newDate, 'MMMM')}`
    )
  }

  const [drawerOpen, setDrawer] = useState(false)

  const handleDrawerState = (state) => {
    setDrawer(state)
  }

  return (
    <div className='App'>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Button
            variant='contained'
            color='primary'
            startIcon={<AddIcon />}
            onClick={handleOpen}
          >
            log time
          </Button>
          <Button
            variant='contained'
            color='primary'
            startIcon={<AddIcon />}
            onClick={() => handleDrawerState(true)}
          >
            info
          </Button>
        </div>
        <div style={{ color: 'white', display: 'flex', alignItems: 'center' }}>
          <Button
            variant='outlined'
            color='primary'
            onClick={() => addMonth(-1)}
          >
            <ArrowBackIcon />
          </Button>
          <span>&nbsp;&nbsp;{year}</span>
          <span style={{ width: '82px', textAlign: 'center' }}>
            {upperFirst(month.toLowerCase())}&nbsp;
          </span>
          <Button
            variant='outlined'
            color='primary'
            onClick={() => addMonth(1)}
          >
            <ArrowForwardIcon />
          </Button>
        </div>
      </div>
      <div style={{ marginTop: '20px' }}>
        {/* <TableContainer component={Paper} style={{ maxHeight: '90vh', overflowY: 'overlay' }}> */}
        <Table stickyHeader size='small'>
          <TableHead>
            <TableRow>
              <TableCell style={{ borderBottomColor: '#303030' }} size='medium'>
                Task
              </TableCell>
              <TableCell style={{ borderBottomColor: '#303030' }} size='medium'>
                Time spent
              </TableCell>
              <TableCell style={{ borderBottomColor: '#303030' }} size='medium'>
                Time range
              </TableCell>
              <TableCell
                style={{ borderBottomColor: '#303030', maxWidth: '100px' }}
                size='medium'
              >
                Task description
              </TableCell>
              <TableCell style={{ borderBottomColor: '#303030' }} size='medium'>
                Task status
              </TableCell>
              <TableCell
                style={{ borderBottomColor: '#303030' }}
                colSpan={2}
                size='medium'
                align='center'
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          {map(calendar, (dates, logDate) => (
            <React.Fragment>
              <TableHead>
                <TableRow>
                  <TableCell colSpan={7} style={{ top: '51px' }} size='medium'>
                    {logDate}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dates.map((values, index) => (
                  <TableRow>
                    <TableCell>{values.task}</TableCell>
                    <TableCell>
                      {differenceInHours(
                        new Date(values.endDate),
                        new Date(values.startDate)
                      )}
                      h{' '}
                      {differenceInMinutes(
                        new Date(values.endDate),
                        new Date(values.startDate)
                      ) -
                        60 *
                          differenceInHours(
                            new Date(values.endDate),
                            new Date(values.startDate)
                          )}
                      m
                    </TableCell>
                    <TableCell>
                      {`(${format(new Date(values.startDate), 'HH.mm')}`}{' '}
                      &ndash; {format(new Date(values.endDate), 'HH.mm')})
                    </TableCell>
                    <TableCell style={{ maxWidth: '100px' }}>
                      {values.description}
                    </TableCell>
                    <TableCell>
                      {values.isLogged ? 'Logged' : 'Not logged'}
                    </TableCell>
                    <TableCell style={{ width: '10px' }}>
                      <Tooltip
                        classes={{ tooltip: classes.tooltip }}
                        title='Edit'
                        placement='top'
                        TransitionComponent={Zoom}
                        arrow
                      >
                        <IconButton color='primary'>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell style={{ width: '10px' }}>
                      <Tooltip
                        classes={{ tooltip: classes.tooltip }}
                        title='Delete'
                        placement='top'
                        TransitionComponent={Zoom}
                        arrow
                      >
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
        {/* {!isLoading && pageCount === 0 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '80px',
              color: 'white',
              fontSize: '15px'
            }}>No times to render</div>
          )} */}

        {(page + 1 < pageCount || isLoading) && (
          <div
            ref={ref}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '80px',
            }}
          >
            <CircularProgress />
          </div>
        )}
        {/* </TableContainer> */}
      </div>
      <Drawer
        anchor='bottom'
        open={drawerOpen}
        onClose={() => handleDrawerState(false)}
      >
        {minutes && (
          <div style={{ height: '100px' }}>
            <div>
              In total: {Math.floor(minutes.minutesTotal / 60)}h{' '}
              {minutes.minutesTotal % 60}m
            </div>
            <div>
              Zenegy: {minutes.minutesZenegy / 60}h {minutes.minutesZenegy % 60}
              m
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}

export default App
