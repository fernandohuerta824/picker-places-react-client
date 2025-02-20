import { useRef, useState, useEffect } from 'react'

import Places from './components/Places.jsx'
import Modal from './components/Modal.jsx'
import DeleteConfirmation from './components/DeleteConfirmation.jsx'
import logoImg from './assets/logo.png'
import AvailablePlaces from './components/AvailablePlaces.jsx'
import { updateUserPlaces } from './utils/http.js'
import ErrorPage from './components/ErrorPage.jsx'

function App () {
    const selectedPlace = useRef()
    const [userPlaces, setUserPlaces] = useState([])
    const [hasError, setHasError] = useState(null)
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [isFetching, setisFetching] = useState(true)
    const [isPutting, setIsPutting] = useState(false)

    function handleStartRemovePlace (place) {
        if(isPutting) {
            return
        }

        setModalIsOpen(true)
        selectedPlace.current = place
    }

    function handleStopRemovePlace () {
        setModalIsOpen(false)
    }

    const handleSelectPlace = async function (selectedPlace) {
        if(isPutting) {
            return
        }

        const prevPlaces = [...userPlaces]
        if (prevPlaces.some((place) => place.id === selectedPlace.id)) {
            return
        }

        const newPlaces = [selectedPlace, ...prevPlaces]
        setIsPutting(true)
        setUserPlaces(newPlaces)
        try {
            await updateUserPlaces(newPlaces)

        } catch (error) {
            setHasError(error)
            setUserPlaces(prevPlaces)
        } finally {
            setIsPutting(false)
        }

    }

    const handleRemovePlace = async function () {
        const prevPlaces = [...userPlaces]
        const newPlaces = prevPlaces.filter((place) => place.id !== selectedPlace.current.id)

        setUserPlaces(newPlaces)
        setModalIsOpen(false)
        setIsPutting(true)

        try {
            await updateUserPlaces(newPlaces)
        } catch (error) {
            setHasError(error)
            setUserPlaces(prevPlaces)
        } finally {
            setIsPutting(false)
        }

    }

    const handleError = () => {
        setHasError(null)
    }

    useEffect(() => {
        // eslint-disable-next-line promise/catch-or-return
        fetch('http://localhost:3000/user-places')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch user places')
                }

                return response.json()
            })
            .then(data => setUserPlaces(data.places))
            .catch(error => setHasError(error))
            .finally(() => {setisFetching(false)})
    }, [])

    return (
        <>
            <Modal open={hasError} onClose={handleError}>
                {hasError && (
                    <ErrorPage
                        title={'An error occurred'}
                        message={hasError.message}
                        onConfirm={handleError}
                    />
                )}
            </Modal>
            <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
                <DeleteConfirmation
                    onCancel={handleStopRemovePlace}
                    onConfirm={handleRemovePlace}
                />
            </Modal>

            <header>
                <img src={logoImg} alt="Stylized globe" />
                <h1>PlacePicker</h1>
                <p>
          Create your personal collection of places you would like to visit or
          you have visited.
                </p>
            </header>
            <main>
                <Places
                    title="I'd like to visit ..."
                    fallbackText="Select the places you would like to visit below."
                    isFetching={isFetching}
                    loadingText={'Fetching places...'}
                    places={userPlaces}
                    onSelectPlace={handleStartRemovePlace}
                />

                <AvailablePlaces onSelectPlace={handleSelectPlace} />
            </main>
        </>
    )
}

export default App
