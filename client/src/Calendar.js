import cal from './cal.ics'
import { useLocation, useHistory } from 'react-router-dom'
import queryString from 'query-string'
import { format, add } from 'date-fns'
import { upperFirst, isEmpty } from 'lodash'
import { useEffect } from 'react'

// Material UI
import { makeStyles, Button } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'

import { CalendarTable } from 'tables'
import { LogTimeForm } from 'forms'
import { usePaginator } from 'hooks'
import { useModalContext } from 'context'

import icsToJson from 'ics-to-json'
// const ical = require('ical');
const ical = require('node-ical')

const convert = async (fileLocation) => {
  const icsRes = await fetch(fileLocation)
  const icsData = await icsRes.text()
  // Convert
  const data = icsToJson(icsData)
  return data
}

const useStyles = makeStyles((theme) => ({
  calendarRoot: {
    minHeight: '100%',
    backgroundColor: theme.palette.background.default,
  },
  headerWrapper: {
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  actionTab: {
    color: 'white',
    '& > * + *': {
      marginLeft: '10px',
    },
  },
}))

export const Calendar = () => {
  // console.log(format)
  const { search } = useLocation()
  const history = useHistory()
  const classes = useStyles()
  const { setModalProps } = useModalContext()

  const {
    year = new Date().getFullYear(),
    month = format(
      new Date(
        new Date().getFullYear(),
        new Date().getMonth() + (new Date().getDate() >= 20 ? 1 : 0)
      ),
      'MMMM'
    ), //new Date().getDate() >= 20, // Should probably open next month after 20th day
  } = queryString.parse(search)

  const [
    calendar,
    { page, pageCount, setPage },
    isLoading,
    resetPaginator,
    fetchUrl,
  ] = usePaginator(`/api/calendar?year=${year}&month=${month}`)

  const handleLogTime = () => {
    setModalProps({
      component: <LogTimeForm />,
      header: 'Log time',
      props: {
        year,
        month,
        resetPaginator,
        fetchUrl,
      },
    })
  }

  useEffect(() => {
    // console.log(convert('http://calendar.google.com/calendar/ical/h24iin6tj57esmfv8qtj4d8nn9ek4h8l%40import.calendar.google.com/public/basic.ics'))
    // fetch('http://ical-to-json.herokuapp.com/convert?url=https://calendar.google.com/calendar/ical/h24iin6tj57esmfv8qtj4d8nn9ek4h8l%40import.calendar.google.com/public/basic.ics')
    //   .then(res => res.json())
    //   .then(data => console.log(data))
    // const events = ical.sync.parseFile(cal);
    // console.log(events)
  }, [])

  const handleMonthChange = (monthCount) => {
    resetPaginator()

    const newDate = add(new Date(`${year} ${month}`), { months: monthCount })
    history.push(
      `/calendar?year=${newDate.getFullYear()}&month=${format(newDate, 'MMMM')}`
    )

    // fetch('https://prod-97.westeurope.logic.azure.com:443/workflows/f76a9d8649ca4186a5f9b687aef07ff6/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ZTVjQ-xbPjtQsZ1KHES527DHvzUnPZ6p6GoWn-suqUQ', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ message: 'HIII' }),
    // })
  }

  console.log(Object.values(calendar).length)

  return (
    <div className={classes.calendarRoot}>
      <div className={classes.headerWrapper}>
        <Button
          variant='contained'
          color='primary'
          startIcon={<AddIcon />}
          onClick={handleLogTime}
        >
          Log time
        </Button>
        <div className={classes.actionTab}>
          <Button
            variant='outlined'
            color='primary'
            onClick={() => handleMonthChange(-1)}
          >
            <ArrowBackIcon />
          </Button>
          <span>{year}</span>
          <span>{upperFirst(month.toLowerCase())}</span>
          <Button
            variant='outlined'
            color='primary'
            onClick={() => handleMonthChange(1)}
          >
            <ArrowForwardIcon />
          </Button>
        </div>
      </div>
      <CalendarTable
        enableInfinityLoading={true}
        calendar={calendar}
        isTableEmpty={!isLoading && pageCount === 0}
        isLastPage={Object.values(calendar).length >= pageCount}
        pageCount={pageCount}
        isLoading={isLoading}
        setPage={setPage}
      />
    </div>
  )
}
