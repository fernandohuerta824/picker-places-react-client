/**
 *
 * @returns {Promise<[]>}
 */
export const fetchAvailablePlaces = async () => {
    const response = await fetch('http://localhost:3000/places')

    if(!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`)
    }

    const { places } = await response.json()

    return places
}

export const updateUserPlaces = async places => {

    const response = await fetch('http://localhost:3000/user-places', {
        method: 'PUT',
        body: JSON.stringify({ places }),
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if(!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`)
    }

    return response.json()
}
