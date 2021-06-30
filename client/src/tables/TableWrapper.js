import React from 'react'
import { Paper, TableContainer, makeStyles } from '@material-ui/core'
import { InView } from 'react-intersection-observer'
import { Loader } from 'components'

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

const TableWrapper = React.forwardRef(
  (
    { children: table, isTableEmpty, isLoaderActive, setPage },
    forwardedRef
  ) => {
    const classes = useStyles()

    return (
      <Paper square elevation={24}>
        <TableContainer id='test' className={classes.tableContainer}>
          {table}
          {isTableEmpty && (
            <div className={classes.tableEmpty}>No times to render</div>
          )}
          {isLoaderActive && (
            <InView
              as='div'
              root={document.getElementById('test')}
              rootMargin='0px 0px 100px 0px'
              onChange={(inView, entry) => {
                setPage((p) => p + 1)
              }}
            >
              <Loader
                id='test'
                isLoaderActive={isLoaderActive}
                ref={forwardedRef}
              />
            </InView>
          )}
        </TableContainer>
      </Paper>
    )
  }
)

export default TableWrapper
