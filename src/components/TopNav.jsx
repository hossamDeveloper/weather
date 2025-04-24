import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { searchCities, setSelectedLocation, fetchCurrentWeather } from '../store/weatherSlice'
import { FaSearch, FaSpinner, FaMapMarkerAlt, FaTimes } from 'react-icons/fa'

const TopNav = () => {
  const dispatch = useDispatch()
  const { searchedCities, loading, selectedLocation } = useSelector((state) => state.weather)
  const [searchQuery, setSearchQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery.length > 2) {
        dispatch(searchCities(searchQuery))
        setIsDropdownOpen(true)
      } else {
        setIsDropdownOpen(false)
      }
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [dispatch, searchQuery])

  const handleCitySelect = (city) => {
    dispatch(setSelectedLocation(city))
    dispatch(fetchCurrentWeather(city))
    setSearchQuery('')
    setIsDropdownOpen(false)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setIsDropdownOpen(false)
  }

  return (
    <div className="relative z-50 flex flex-col md:flex-row items-center justify-between gap-4 p-6 bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30">
      <div className="flex items-center gap-3">
        <FaMapMarkerAlt className="h-7 w-7 text-blue-600" />
        <span className="text-2xl font-bold text-gray-800">
          {selectedLocation ? `${selectedLocation.name}, ${selectedLocation.country}` : 'اختر مدينة'}
        </span>
      </div>

      <div className="flex-1 max-w-md relative">
        <div className="relative">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                if (e.target.value.length > 2) {
                  setIsDropdownOpen(true)
                }
              }}
              placeholder="ابحث عن مدينة..."
              className="w-full px-4 py-3 pr-12 rounded-full bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="h-4 w-4" />
              </button>
            )}
            {loading.cities ? (
              <FaSpinner className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-spin text-blue-500" />
            ) : (
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
            )}
          </div>
        </div>
        
        {isDropdownOpen && (
          <div className="fixed z-[9999] w-full max-w-md mt-2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 max-h-60 overflow-y-auto">
            {loading.cities ? (
              <div className="p-4 text-center text-gray-600">
                <FaSpinner className="animate-spin mx-auto mb-2 text-blue-500" />
                جاري البحث...
              </div>
            ) : searchedCities.length > 0 ? (
              <ul className="py-2">
                {searchedCities.map((city) => (
                  <li
                    key={`${city.lat}-${city.lon}`}
                    onClick={() => handleCitySelect(city)}
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-gray-800 transition-colors duration-200 flex justify-between items-center"
                  >
                    <span>
                      {city.name}, {city.state ? `${city.state}, ` : ''}{city.country}
                    </span>
                    <FaMapMarkerAlt className="text-blue-500" />
                  </li>
                ))}
              </ul>
            ) : searchQuery.length > 2 ? (
              <div className="p-4 text-center text-gray-600">
                لا توجد نتائج للبحث
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}

export default TopNav 