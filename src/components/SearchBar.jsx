import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedLocation, fetchCurrentWeather, fetchForecast } from '../store/weatherSlice'

const SearchBar = () => {
  const dispatch = useDispatch()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const handleSearch = async (query) => {
    if (query.length < 2) {
      setSearchResults([])
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/search.json?key=${import.meta.env.VITE_WEATHER_API_KEY}&q=${query}`
      )
      const data = await response.json()
      setSearchResults(data)
    } catch (error) {
      console.error('Error searching locations:', error)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch(searchQuery)
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  const handleLocationSelect = (location) => {
    const selectedLocation = {
      name: location.name,
      region: location.region,
      country: location.country,
      lat: location.lat,
      lon: location.lon
    }
    dispatch(setSelectedLocation(selectedLocation))
    dispatch(fetchCurrentWeather(selectedLocation))
    dispatch(fetchForecast(selectedLocation))
    setSearchQuery(`${location.name}, ${location.region ? location.region + ', ' : ''}${location.country}`)
    setSearchResults([])
    setShowResults(false)
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setShowResults(true)
          }}
          placeholder="Search for a location..."
          className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
      
      {showResults && searchResults.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-gray-800 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {searchResults.map((location, index) => (
            <div
              key={index}
              onClick={() => handleLocationSelect(location)}
              className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center justify-between"
            >
              <div>
                <div className="font-medium text-white">{location.name}</div>
                <div className="text-sm text-gray-400">
                  {location.region && `${location.region}, `}
                  {location.country}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {location.lat.toFixed(2)}, {location.lon.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}

      {showResults && searchQuery.length >= 2 && !isLoading && searchResults.length === 0 && (
        <div className="absolute z-10 w-full mt-2 bg-gray-800 rounded-lg shadow-lg p-4 text-center text-gray-400">
          No locations found
        </div>
      )}
    </div>
  )
}

export default SearchBar 