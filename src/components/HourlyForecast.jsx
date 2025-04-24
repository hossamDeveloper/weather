import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchForecast } from '../store/weatherSlice'

const HourlyForecast = () => {
  const dispatch = useDispatch()
  const { forecast, selectedLocation, loading, error } = useSelector((state) => state.weather)

  useEffect(() => {
    if (selectedLocation) {
      dispatch(fetchForecast(selectedLocation))
    }
  }, [dispatch, selectedLocation])

  if (loading) {
    return (
      <div className="mt-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-8 text-center text-red-500">
        Error loading hourly forecast data
      </div>
    )
  }

  if (!forecast) {
    return null
  }

  const getWeatherIcon = (condition) => {
    const icons = {
      'Sunny': '☀️',
      'Clear': '🌙',
      'Partly cloudy': '⛅',
      'Cloudy': '☁️',
      'Overcast': '☁️',
      'Mist': '🌫️',
      'Fog': '🌫️',
      'Light rain': '🌦️',
      'Moderate rain': '🌧️',
      'Heavy rain': '⛈️',
      'Light snow': '🌨️',
      'Moderate snow': '🌨️',
      'Heavy snow': '❄️',
      'Thunderstorm': '⛈️',
    }
    return icons[condition] || '🌤️'
  }

  const formatTime = (time) => {
    return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Hourly Forecast</h2>
      <div className="bg-gray-800 rounded-xl p-4 overflow-x-auto">
        <div className="flex space-x-4 min-w-max">
          {forecast.forecast.forecastday[0].hour.map((hour, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-4 bg-gray-700 rounded-lg min-w-[120px] hover:bg-gray-600 transition-colors"
            >
              <div className="text-lg font-medium mb-1">{formatTime(hour.time)}</div>
              <div className="text-3xl mb-2">{getWeatherIcon(hour.condition.text)}</div>
              <div className="text-xl font-bold mb-1">{hour.temp_c}°C</div>
              <div className="text-sm text-gray-400 mb-1">{hour.condition.text}</div>
              <div className="flex items-center text-sm text-gray-400">
                <span className="mr-1">💨</span>
                {hour.wind_kph} km/h
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <span className="mr-1">💧</span>
                {hour.humidity}%
              </div>
              {hour.chance_of_rain > 0 && (
                <div className="flex items-center text-sm text-blue-400">
                  <span className="mr-1">🌧️</span>
                  {hour.chance_of_rain}%
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HourlyForecast 