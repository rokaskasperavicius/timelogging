import { useState, useCallback } from 'react'

import { useNotifications } from 'hooks';

const useMutation = (url, message, actions) => {
  const [notify] = useNotifications()

  const [isLoading, setIsLoading] = useState(false)

  const sendData = useCallback(async (data) => {
    const renderError = (error) => {
      notify('error', error)
    }

    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 500))

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const result = await response.json().catch(() => renderError())

    if (response.status === 200) {
      notify('success', message)

      actions.onSuccess(data)
    } else {
      renderError(result.error)
    }

    setIsLoading(false)
  }, [url, message, actions, notify])

  return [sendData, isLoading]
}

export default useMutation
