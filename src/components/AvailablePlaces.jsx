import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import Places from './Places.jsx'
import ErrorPage from './ErrorPage.jsx'
import { sortPlacesByDistance } from '../utils/loc.js'
import { fetchAvailablePlaces } from '../utils/http.js'

const AvailablePlaces = (function ({ onSelectPlace }) {
    const [places, setPlaces] = useState([])
    const [hasError, setHasError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [mustDataFetched, setMustDataFetched] = useState(true)

    useEffect(() => {
        if(!mustDataFetched) {
            return
        }

        const fetchPlaces = async () => {
            try {
                setIsLoading(true)

                const places = await fetchAvailablePlaces()

                navigator.geolocation.getCurrentPosition((
                    { coords: { latitude, longitude } },
                ) => {
                    setHasError(null)
                    setPlaces(sortPlacesByDistance(places, latitude, longitude))
                    setIsLoading(false)
                    setMustDataFetched(false)
                }, () => {
                    setHasError(new Error('Geolocation failed'))
                    setIsLoading(false)
                    setMustDataFetched(false)
                })
            } catch(error) {
                setIsLoading(false)
                setHasError(error)
                setMustDataFetched(false)

            }
        }

        fetchPlaces()
    }, [mustDataFetched])

    return (
        <>
            {hasError && (
                <ErrorPage
                    title='An error ocurred
                    'message={hasError.message || 'Something went wrong'}
                />
            )}
            {!hasError && (
                <Places
                    title="Available Places"
                    isLoading={isLoading}
                    loadingText={'Fetching places...'}
                    places={places}
                    fallbackText="No places available."
                    onSelectPlace={onSelectPlace}
                />
            )}
        </>

    )
})

AvailablePlaces.displayName = 'AvailablePlaces'

AvailablePlaces.propTypes = {
    onSelectPlace: PropTypes.func.isRequired,
}

export default AvailablePlaces
