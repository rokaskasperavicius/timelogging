import React from 'react'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'

import { map, groupBy, concat } from 'lodash'
import {
  Button,
  IconButton,
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
import { format, differenceInHours, differenceInMinutes } from 'date-fns'

import TableWrapper from 'tables';

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
  tableHeadCell: {
    border: 'unset',
  },
}))

const CalendarTable = ({ calendar, isLoading, page, pageCount }) => {
  const classes = useStyles()

  const sortedCalendar = groupBy(concat(...Object.values(calendar)), (values) =>
    format(new Date(values.startDate), 'yyyy MMMM dd')
  )

  return (
    <TableWrapper isTableEmpty={!isLoading && pageCount === 0} isLoaderActive>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableHeadCell} size="medium">
              Task
            </TableCell>
            <TableCell style={{ borderBottomColor: '#303030' }} size="medium">
              Time spent
            </TableCell>
            <TableCell style={{ borderBottomColor: '#303030' }} size="medium">
              Time range
            </TableCell>
            <TableCell
              style={{ borderBottomColor: '#303030', maxWidth: '100px' }}
              size="medium"
            >
              Task description
            </TableCell>
            <TableCell style={{ borderBottomColor: '#303030' }} size="medium">
              Task status
            </TableCell>
            <TableCell
              style={{ borderBottomColor: '#303030' }}
              colSpan={2}
              size="medium"
              align="center"
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        {map(sortedCalendar, (date, logDate) => (
          <React.Fragment>
            <TableHead>
              <TableRow>
                <TableCell colSpan={7} style={{ top: '51px' }} size="medium">
                  {logDate}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {date.map((values, index) => (
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
                    {`(${format(new Date(values.startDate), 'HH.mm')}`} &ndash;{' '}
                    {format(new Date(values.endDate), 'HH.mm')})
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
                      title="Edit"
                      placement="top"
                      TransitionComponent={Zoom}
                      arrow
                    >
                      <IconButton color="primary">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell style={{ width: '10px' }}>
                    <Tooltip
                      classes={{ tooltip: classes.tooltip }}
                      title="Delete"
                      placement="top"
                      TransitionComponent={Zoom}
                      arrow
                    >
                      <IconButton color="secondary">
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
    </TableWrapper>
  )
}

export default CalendarTable
