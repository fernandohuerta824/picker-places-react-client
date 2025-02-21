import PropTypes from 'prop-types'

import Places from './Places.jsx'
import ErrorPage from './ErrorPage.jsx'
import { sortPlacesByDistance } from '../utils/loc.js'
import { fetchAvailablePlaces } from '../utils/http.js'
import { useFetch } from '../hooks/usePlaces.js'

const fetchAvailablesPlaces = async () => {
    const places = await fetchAvailablePlaces()

    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((
            { coords: { latitude, longitude } },
        ) => resolve(sortPlacesByDistance(places, latitude, longitude))
        , () => reject(new Error('Geolocation failed')))

    })
}

const AvailablePlaces = (function ({ onSelectPlace }) {
    const { fetchedData: places, isFetching, hasError } = useFetch(fetchAvailablesPlaces)

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
                    isLoading={isFetching}
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
