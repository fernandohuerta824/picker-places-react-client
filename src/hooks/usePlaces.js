import { useCallback, useEffect, useState } from 'react'

/**
 *
 * @param {Function} fetchFn
 * @param  {...any} params
 * @returns {{isFetching: Boolean, hasError: Error|null, fetchedData: any, refetch: Function, setFetchedData: Function}}
 */
export const useFetch = (fetchFn, ...params) => {
    const [isFetching, setIsFetching] = useState(true)
    const [hasError, setHasError] = useState(null)
    const [fetchedData, setFetchedData] = useState()
    const [mustDataFetched, setMustDataFetched] = useState(true)

    const refetch = () => setMustDataFetched(true)

    const fetchData = useCallback(async () => {
        if(!mustDataFetched) {
            return
        }

        setHasError(null)
        setIsFetching(true)
        try {
            const data = await fetchFn(...params)
            setFetchedData(data)
        } catch (error) {
            setHasError(error)
        } finally {
            setIsFetching(false)
            setMustDataFetched(false)
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchFn, ...params, mustDataFetched])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return { isFetching, hasError, fetchedData, refetch, setFetchedData }
}
