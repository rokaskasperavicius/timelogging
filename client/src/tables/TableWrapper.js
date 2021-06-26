import React from 'react'
import {
  Paper,
  TableContainer,
  makeStyles,
} from '@material-ui/core'

import Loader from 'components'

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    maxHeight: '90vh',
    overflowY: 'overlay',
  },
  tableEmpty: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '80px',
    color: 'white',
    fontSize: '15px',
  }
}))

const TableWrapper = React.forwardRef(({
  children,
  isTableEmpty,
  isLoaderActive,
}, forwardedRef) => {
  const classes = useStyles()

  return (
    <TableContainer
      component={Paper}
      className={classes.tableContainer}
    >
      {children}
      {isTableEmpty && (
        <div
          className={classes.tableEmpty}
        >
          No times to render
        </div>
      )}
      {isLoaderActive && (
        <Loader
          isLoaderActive={isLoaderActive}
          ref={forwardedRef}
        />
      )}
    </TableContainer>
  )
})

export default TableWrapper
