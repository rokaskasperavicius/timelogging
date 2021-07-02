import { useEffect, useState } from 'react'
import { isEmpty } from 'lodash'

import { useFetch } from 'hooks'

export const usePaginator = (url) => {
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [pages, setPages] = useState([])

  const [response, isLoading, fetchUrl] = useFetch(url + `&page=${page}`)

  useEffect(() => {
    if (!isEmpty(response)) {
      const { data, page, pages } = response

      setPageCount(pages)

      setPages((p) => ({
        ...p,
        [page]: data,
      }))
    }
  }, [response])

  const resetPaginator = () => {
    setPages([])
    setPageCount(0)
    setPage(0)
  }

  return [
    pages,
    {
      page,
      pageCount,
      setPage,
    },
    isLoading,
    resetPaginator,
    fetchUrl,
  ]
}
