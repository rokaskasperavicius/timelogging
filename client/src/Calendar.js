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

  const handleMonthChange = (monthCount) => {
    resetPaginator()

    const newDate = add(new Date(`${year} ${month}`), { months: monthCount })
    history.push(
      `/calendar?year=${newDate.getFullYear()}&month=${format(newDate, 'MMMM')}`
    )
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
