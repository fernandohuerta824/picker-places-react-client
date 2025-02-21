import PropTypes from 'prop-types'

export default function Places ({
    title,
    places,
    fallbackText,
    onSelectPlace,
    isLoading,
    loadingText,
}) {

    return (
        <section className="places-category">
            <h2>{title}</h2>
            {isLoading && <p className='fallback-text'>{loadingText}</p>}
            {!isLoading && places?.length === 0 && <p className="fallback-text">{fallbackText}</p>}
            {!isLoading && places?.length > 0 && (
                <ul className="places">
                    {places.map((place) => (
                        <li key={place.id} className="place-item">
                            <button onClick={() => onSelectPlace(place)}>
                                <img src={`http://localhost:3000/${place.image.src}`} alt={place.image.alt} />
                                <h3>{place.title}</h3>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}

Places.propTypes = {
    title: PropTypes.string.isRequired,
    places: PropTypes.array.isRequired,
    fallbackText: PropTypes.string.isRequired,
    onSelectPlace: PropTypes.func.isRequired,
    loadingText: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
}
