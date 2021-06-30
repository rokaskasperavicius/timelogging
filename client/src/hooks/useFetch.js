import { useEffect, useState, useCallback } from 'react'

import { useNotifications } from 'hooks'

const useFetch = (baseUrl) => {
  const [notify] = useNotifications()

  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState([])

  const fetchUrl = useCallback(
    async (url) => {
      const renderError = (error) => {
        notify('error', error)
      }

      setIsLoading(true)

      await new Promise((resolve) => setTimeout(resolve, 500))

      const response = await fetch(url || baseUrl)
      const result = await response.json().catch(() => renderError())

      if (response.status === 200) {
        setData(result)
      } else {
        if (result) {
          renderError(result.error)
        }
      }

      setIsLoading(false)
    },
    [baseUrl, notify]
  )

  useEffect(() => {
    fetchUrl()
  }, [fetchUrl])

  return [data, isLoading, fetchUrl]
}

export default useFetch
