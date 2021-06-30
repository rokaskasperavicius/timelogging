import { useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { format } from 'date-fns'

// Material UI
import { makeStyles, Button } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'

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
  },
}))

export const Calendar = () => {
  const { search } = useLocation()
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

  const [calendar, { page, pageCount, setPage }, isLoading, resetPaginator] =
    usePaginator(`/api/calendar?year=${year}&month=${month}`)

  const handleLogTime = () => {
    setModalProps({
      component: <LogTimeForm />,
      header: 'Log time',
      props: {
        year,
        month,
        resetPaginator,
      },
    })
  }

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
      </div>
      <CalendarTable
        calendar={calendar}
        isLoading={page + 1 < pageCount}
        pageCount={pageCount}
        setPage={setPage}
      />
    </div>
  )
}
