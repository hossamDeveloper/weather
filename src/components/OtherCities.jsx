import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { FaChevronRight, FaExclamationCircle } from 'react-icons/fa'
import { setSelectedLocation, fetchCurrentWeather } from '../store/weatherSlice'

const OtherCities = () => {
  const dispatch = useDispatch()
  const [popularCities, setPopularCities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const defaultCities = [
    { name: 'القاهرة', country: 'EG', lat: 30.0444, lon: 31.2357 },
    { name: 'الإسكندرية', country: 'EG', lat: 31.2001, lon: 29.9187 },
    { name: 'الغردقة', country: 'EG', lat: 27.2579, lon: 33.8116 },
    { name: 'شرم الشيخ', country: 'EG', lat: 27.9158, lon: 34.3300 },
    { name: 'أسوان', country: 'EG', lat: 24.0889, lon: 32.8998 },
    { name: 'الأقصر', country: 'EG', lat: 25.6872, lon: 32.6396 }
  ]

  useEffect(() => {
    const fetchCitiesWeather = async () => {
      setLoading(true)
      setError(null)
      try {
        // في حالة عدم وجود مفتاح API، نستخدم بيانات افتراضية
        if (!import.meta.env.VITE_OPENWEATHER_API_KEY) {
          const mockData = defaultCities.map(city => ({
            ...city,
            temp: Math.floor(Math.random() * (35 - 20) + 20), // درجة حرارة عشوائية بين 20 و 35
            condition: 'مشمس',
            icon: '☀️'
          }))
          setPopularCities(mockData)
          setLoading(false)
          return
        }

        const citiesData = await Promise.all(
          defaultCities.map(async (city) => {
            try {
              const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}&units=metric&lang=ar`
              )
              if (!response.ok) {
                throw new Error(`Error fetching weather for ${city.name}`)
              }
              const data = await response.json()
              return {
                ...city,
                temp: Math.round(data.main.temp),
                condition: data.weather[0].description,
                icon: getWeatherIcon(data.weather[0].main)
              }
            } catch (err) {
              // إذا فشل جلب بيانات مدينة معينة، نستخدم بيانات افتراضية لها
              return {
                ...city,
                temp: Math.floor(Math.random() * (35 - 20) + 20),
                condition: 'مشمس',
                icon: '☀️'
              }
            }
          })
        )
        setPopularCities(citiesData)
      } catch (error) {
        console.error('Error fetching cities weather:', error)
        setError('حدث خطأ في جلب بيانات المدن')
        // في حالة الخطأ، نستخدم بيانات افتراضية
        const mockData = defaultCities.map(city => ({
          ...city,
          temp: Math.floor(Math.random() * (35 - 20) + 20),
          condition: 'مشمس',
          icon: '☀️'
        }))
        setPopularCities(mockData)
      } finally {
        setLoading(false)
      }
    }

    fetchCitiesWeather()
  }, [])

  const getWeatherIcon = (condition) => {
    const icons = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Snow': '🌨️',
      'Thunderstorm': '⛈️',
      'Drizzle': '🌦️',
      'Mist': '🌫️',
      'Smoke': '🌫️',
      'Haze': '🌫️',
      'Dust': '🌫️',
      'Fog': '🌫️',
      'Sand': '🌫️',
      'Ash': '🌫️',
      'Squall': '🌪️',
      'Tornado': '🌪️'
    }
    return icons[condition] || '❓'
  }

  const handleCitySelect = (city) => {
    dispatch(setSelectedLocation({
      name: city.name,
      country: city.country,
      lat: city.lat,
      lon: city.lon
    }))
    dispatch(fetchCurrentWeather({
      lat: city.lat,
      lon: city.lon
    }))
  }

  if (loading) {
    return (
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/30">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">مدن أخرى</h2>
        </div>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/30 hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">مدن أخرى</h2>
        {error && (
          <div className="flex items-center gap-2 text-yellow-600">
            <FaExclamationCircle />
            <span className="text-sm">تم استخدام بيانات افتراضية</span>
          </div>
        )}
      </div>
      <div className="space-y-4">
        {popularCities.map((city) => (
          <div
            key={`${city.lat}-${city.lon}`}
            onClick={() => handleCitySelect(city)}
            className="flex items-center justify-between p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30 hover:bg-white/70 transition-all duration-300 cursor-pointer"
          >
            <div>
              <div className="font-medium text-gray-800">
                {city.name}
              </div>
              <div className="text-sm text-gray-600">{city.condition}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{city.icon}</span>
              <span className="text-xl font-bold text-gray-800">{city.temp}°C</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OtherCities 