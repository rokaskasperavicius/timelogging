import { useEffect, useState, useCallback } from 'react'

import { useFetch } from 'hooks'


const usePaginator = (url) => {
  const [pages, setPages] = useState()
  const [pageCount, setPageCount] = useState(0)

  const [data, isLoading, fetchUrl] = useFetch(url)

  console.log(data, pages)
  useEffect(() => {
    if (data) {
      const { calendar, page, pages } = data

      setPageCount(pages)
      
      setPages(p => ({
        ...p,
        [page]: calendar,
      }))
    }
  }, [data])

  const clearPages = () => {
    setPages(undefined)
  }

  return [pages, pageCount, isLoading, clearPages, fetchUrl]
}

export default usePaginator
