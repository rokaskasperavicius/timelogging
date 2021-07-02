import React from 'react'
import { Paper, TableContainer, makeStyles } from '@material-ui/core'
import { InView } from 'react-intersection-observer'
import { Spinner } from 'components'

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    overflowY: 'overlay',
    maxHeight: 'calc(100% - 73px - 100px)', // 73px for the header
    '& tr:hover': {
      backgroundColor: '#3b3b3b',
    },
  },
  tableEmpty: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '80px',
    color: 'white',
    fontSize: '15px',
  },
}))

const TableWrapper = ({
  children: table,
  isTableEmpty,
  isLastPage,
  isLoading,
  enableInfinityLoading = false,
  setPage,
}) => {
  const classes = useStyles()

  return (
    <Paper square elevation={24}>
      <TableContainer id='test' className={classes.tableContainer}>
        {table}
        {isTableEmpty ? (
          <div className={classes.tableEmpty}>No times to render</div>
        ) : (
          !isLastPage && (
            <InView
              as='div'
              root={document.getElementById('test')}
              rootMargin='0px 0px -30px 0px'
              skip={isLoading}
              onChange={(inView) => {
                if (enableInfinityLoading && inView) {
                  setPage((p) => p + 1)
                }
              }}
            >
              <Spinner />
            </InView>
          )
        )}
      </TableContainer>
    </Paper>
  )
}

export default TableWrapper
