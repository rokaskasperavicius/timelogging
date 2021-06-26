import {
  CircularProgress,
  makeStyles,
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  loaderWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '80px',
  },
}));

const Loader = ({
  isActive = true,
}) => {
  const classes = useStyles()

  if (isActive) {
    return (
      <div
        className={classes.loaderWrapper}
      >
        <CircularProgress />
      </div>
    )
  }
}

export default Loader
