import { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCurrentWeather } from '../store/weatherSlice'
import { FaWind, FaTint, FaCloudRain, FaTemperatureHigh, FaTemperatureLow } from 'react-icons/fa'

const WeeklyForecast = () => {
  const dispatch = useDispatch()
  const { forecast, selectedLocation, loading } = useSelector((state) => state.weather)
  const [selectedDay, setSelectedDay] = useState(null)

  useEffect(() => {
    if (selectedLocation) {
      dispatch(fetchCurrentWeather(selectedLocation))
    }
  }, [dispatch, selectedLocation])

  if (loading.weather) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!forecast || !forecast.list || forecast.list.length === 0) {
    return null
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString('ar-SA', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    })
  }

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

  const dailyForecast = forecast.list.reduce((acc, item) => {
    const date = new Date(item.dt * 1000)
    const day = date.toLocaleDateString('ar-SA', { weekday: 'long' })
    
    if (!acc[day]) {
      acc[day] = {
        date: item.dt,
        temp: Math.round(item.main.temp),
        description: item.weather[0].description,
        icon: getWeatherIcon(item.weather[0].main),
        high: Math.round(item.main.temp_max),
        low: Math.round(item.main.temp_min),
        wind: item.wind.speed,
        humidity: item.main.humidity,
        pop: item.pop ? Math.round(item.pop * 100) : 0
      }
    }
    return acc
  }, {})

  const handleDayClick = (day) => {
    setSelectedDay(day)
  }

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/30 hover:shadow-xl transition-all duration-300">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">توقعات الطقس للأسبوع</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(dailyForecast).map(([day, data]) => (
          <div
            key={day}
            onClick={() => handleDayClick(day)}
            className={`bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30 cursor-pointer transition-all duration-300 ${
              selectedDay === day ? 'ring-2 ring-blue-500' : 'hover:bg-white/70'
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-3xl mb-2">{data.icon}</div>
                <div className="text-2xl font-bold text-gray-800">{data.temp}°C</div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-800">{day}</div>
                <div className="text-sm text-gray-600 capitalize">{data.description}</div>
              </div>
            </div>

            {selectedDay === day && (
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <FaTemperatureHigh className="text-red-500" />
                  <span className="text-gray-600">العظمى:</span>
                  <span className="font-semibold text-gray-800">{data.high}°C</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaTemperatureLow className="text-blue-500" />
                  <span className="text-gray-600">الصغرى:</span>
                  <span className="font-semibold text-gray-800">{data.low}°C</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaWind className="text-blue-600" />
                  <span className="text-gray-600">الرياح:</span>
                  <span className="font-semibold text-gray-800">{data.wind} م/ث</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaTint className="text-blue-600" />
                  <span className="text-gray-600">الرطوبة:</span>
                  <span className="font-semibold text-gray-800">{data.humidity}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCloudRain className="text-blue-600" />
                  <span className="text-gray-600">الأمطار:</span>
                  <span className="font-semibold text-gray-800">{data.pop}%</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default WeeklyForecast 