import React from 'react'
import { InView } from 'react-intersection-observer'
import { motion } from 'framer-motion'

// Material UI
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import {
  Paper,
  TableContainer,
  makeStyles,
  IconButton,
  Tooltip,
  Zoom,
} from '@material-ui/core'

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
  scrollToTop: {
    display: 'flex',
    justifyContent: 'center',
    padding: '10px',
  },
  tooltip: {
    fontSize: '13px',
  },
}))

const TableWrapper = ({
  children: table,
  isTableEmpty,
  isLastPage,
  isLoading,
  pageCount,
  enableInfinityLoading = false,
  setPage,
}) => {
  const classes = useStyles()

  console.log({ isLastPage })

  return (
    <Paper square elevation={24}>
      <TableContainer id='test' className={classes.tableContainer}>
        {table}
        {isTableEmpty ? (
          <div className={classes.tableEmpty}>No times to render</div>
        ) : !isLastPage ? (
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
        ) : (
          pageCount > 1 && (
            <div className={classes.scrollToTop}>
              {/* <Tooltip
                  title='Go Back'
                  placement='top'
                  TransitionComponent={Zoom}
                  classes={{ tooltip: classes.tooltip }}
                  arrow
                > */}
              <motion.div whileHover={{ y: -5 }}>
                <IconButton
                  color='primary'
                  onClick={() =>
                    document
                      .getElementById('test')
                      .scroll({ top: 0, behavior: 'smooth' })
                  }
                >
                  <KeyboardArrowUpIcon fontSize='large' />
                </IconButton>
              </motion.div>
              {/* </Tooltip> */}
            </div>
          )
        )}
      </TableContainer>
    </Paper>
  )
}

export default TableWrapper
