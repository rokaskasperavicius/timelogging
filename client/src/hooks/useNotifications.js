import { useEffect, useState, useCallback } from 'react'
import { useSnackbar } from 'notistack';

const defaultMessages = {
  'error': 'Something went wrong! Please try again :)',
  'success': 'The data successfully added'
}

const useNotifications = () => {
  const { enqueueSnackbar } = useSnackbar()

  const notify = useCallback((type, message) => {
    enqueueSnackbar(message || defaultMessages[type], {
      variant: type,
    })
  }, [enqueueSnackbar])

  return [notify]
}

export default useNotifications
