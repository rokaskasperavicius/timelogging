import { useLocation, useHistory } from 'react-router-dom'
import queryString from 'query-string'
import { format, add } from 'date-fns'
import { upperFirst, isEmpty } from 'lodash'
import { useEffect } from 'react'

import axios from 'axios'

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

  useEffect(() => {
    const fetchData = async () => {
      const data = await axios.post(
        `https://ob.nordigen.com/api/v2/token/new`,
        {
          secret_id: 'b64511d2-e53e-45bc-995e-c6ef525c2189',
          secret_key:
            'bf3b152bf90e8cfe6af331f44e46f88da653aaf692a7bf62c9652db5153d324a90abb4d5c04a03eab61a6f03cd41731276ec84c1e757f931954227d7d534a482',
        }
      )

      console.log('asdasdasd')
      console.log(data)
    }

    fetchData()
  }, [])

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
