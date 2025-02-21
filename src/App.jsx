import { useRef, useState } from 'react'

import Places from './components/Places.jsx'
import Modal from './components/Modal.jsx'
import DeleteConfirmation from './components/DeleteConfirmation.jsx'
import logoImg from './assets/logo.png'
import AvailablePlaces from './components/AvailablePlaces.jsx'
import { fetchUserPlaces, updateUserPlaces } from './utils/http.js'
import ErrorPage from './components/ErrorPage.jsx'
import { useFetch } from './hooks/usePlaces.js'

function App () {
    const selectedPlace = useRef()
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [isPutting, setIsPutting] = useState(false)
    const { isFetching, hasError, fetchedData: userPlaces, setFetchedData: setUserPlaces, refetch } = useFetch(fetchUserPlaces)
    const [hasErrorUpdating, setHasErrorUpdating] = useState(null)

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
            setHasErrorUpdating(error)
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
            setHasErrorUpdating(error)
            setUserPlaces(prevPlaces)
        } finally {
            setIsPutting(false)
        }

    }

    const handleError = () => {
        setHasErrorUpdating(null)
    }

    return (
        <>
            <Modal open={hasErrorUpdating} onClose={handleError}>
                {hasErrorUpdating && (
                    <ErrorPage
                        title={'An error occurred'}
                        message={hasErrorUpdating.message}
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
                {hasError && (
                    <ErrorPage
                        title='An error ocurred'
                        message={hasError.message || 'Something went wrong'}
                    />
                )}
                {! hasError &&
                    (<Places
                        title="I'd like to visit ..."
                        fallbackText="Select the places you would like to visit below."
                        isLoading={isFetching}
                        loadingText={'Fetching places...'}
                        places={userPlaces}
                        onSelectPlace={handleStartRemovePlace}
                    />)
                }
                <button onClick={refetch}>
                    refetch
                </button>

                <AvailablePlaces onSelectPlace={handleSelectPlace} />
            </main>
        </>
    )
}

export default App
