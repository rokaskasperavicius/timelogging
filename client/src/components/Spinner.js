import { CircularProgress, makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  spinnerWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '80px',
  },
}))

const getSize = (value) => {
  switch (value) {
    case 'small':
      return 20
    case 'medium':
      return 40
    case 'large':
      return 60
    default:
      return 40
  }
}

export const Spinner = ({ isActive = true, size = 'medium' }) => {
  const classes = useStyles()

  if (isActive) {
    return (
      <div className={classes.spinnerWrapper}>
        <CircularProgress size={getSize(size)} />
      </div>
    )
  }
}
